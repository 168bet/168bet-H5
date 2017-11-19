var PathMgr2 = (function (_super) {
	function PathMgr2() {
		PathMgr2.super(this);
		this.init();
	}
	Laya.class(PathMgr2, "PathMgr2", _super);

	var __proto = PathMgr2.prototype;

	__proto.init = function() {
		this.maxRow = 96;  // 存放行数
		this.maxCol = 144; // 存放列数
		var gridWidth = 10;
		var gridHeight = 10;

		this.maps = [];

		for (var i = 0; i < this.maxRow; i++) {
			this.maps[i] = [];
			for (var j = 0; j < this.maxCol; j++) {
				this.maps[i][j] = {x:j,y:i};
			}
		}
	};

	__proto.createPoint = function(x,y) {
		return {x: x, y: y};
	};

	__proto.addPoints = function (a, b) {
		var self = this;
		return self.createPoint(a.x + b.x, a.y + b.y);
	};

	__proto.samePoint = function (a, b) {
		return a.x === b.x && a.y === b.y;
	};

	__proto.insideMap = function (point) {
		return point.x >= 0 && point.x <= this.maxCol && point.y >= 0 && point.y <= this.maxRow;
	};

	__proto.getNeighbours = function (point) {
		var points = [
			{x: -1, y: 0},
			{x: -1, y: -1},
			{x: 0, y: -1},
			{x: 1, y: -1},
			{x: 1, y: 0},
			{x: 1, y: 1},
			{x: 0, y: 1},
			{x: -1, y: 1}
		];
		var self = this;
		return filter(self,self.insideMap, map(self,partial(self,self.addPoints, point), points));
	};

	//TODO: use id generation for querying in order to increase performance
	//TODO: use data-X instead of className for storing state
	__proto.isPassable = function () {
		return true;
	};

	__proto.getPassableNeighbours = function (point) {
		var self = this;
		return filter(self,self.isPassable, self.getNeighbours(point));
	};

	__proto.calculateOptimisticDistance = function (from, to) {
		var UNIT_SIZE = 10;
		return (Math.abs(to.x - from.x) + Math.abs(to.y - from.y)) * UNIT_SIZE;
	};

	__proto.calculateDistanceBetweenNeighbours = function (parentPoint, childPoint) {
		return parentPoint.x === childPoint.x || parentPoint.y === childPoint.y ? 10 : 14;
	};

	__proto.calculateG = function (point) {
		var
			parentPoint = point.parentPoint,
			distanceToParent = this.calculateDistanceBetweenNeighbours(parentPoint, point)
		;

		if (parentPoint) {
			return distanceToParent + parentPoint.g;
		}
		else {
			return distanceToParent;
		}
	};


	__proto.findWay = function (start, end) {
		var
			self = this,
			from = start,
			to = end,
			openList = new BinaryHeap(function (point) {
				point.f = self.calculateOptimisticDistance(point, to) + point.g;
				return point.f;
			}),
			closedList = []
		;

		var isInOpenList = function (point) {
			return any(self,function (el) {
				return point.x === el.x && point.y === el.y;
			}, openList.content);
		};

		var isInClosedList = function (point) {
			return any(self,function (el) {
				return point.x === el.x && point.y === el.y;
			}, closedList);
		};

		from.g = 0;
		openList.push(from);
		var pointReached = false;
		var find = function find() {
			var currentStart = openList.pop();
			closedList.push(currentStart);

			forEach(self,function (el) {
				if ( !(isInClosedList(el)) ) {
					if ( !(isInOpenList(el)) ) {
						el.parentPoint = currentStart;
						el.g = self.calculateG(el);
						openList.push(el);
						if (el.x === to.x && el.y === to.y) {
							pointReached = true; //TODO: change this temporary stub
						}
					}
					else {
						var newG = self.calculateDistanceBetweenNeighbours(currentStart, el) + currentStart.g;
						if (newG < el.g) {
							

							openList.remove(el);

							el.parentPoint = compare;
							el.g = self.calculateG(el);

							openList.push(el);
						}
					}
				}
				return el;
			}, self.getPassableNeighbours(currentStart));

			if (!pointReached) {
				find();
			}
			else {
				
			}
		};

		find();

		var path = openList.pop();
		var parentPoint = path.parentPoint;
		var pathList = [];
		pathList.push({x:path.x, y:path.y});
		while(parentPoint)
		{
			pathList.push({x:parentPoint.x, y:parentPoint.y});
			parentPoint = parentPoint.parentPoint;
		}
		pathList.reverse();
		openList.clear();
		return pathList;
	};

	return PathMgr2;
})(Laya.EventDispatcher);