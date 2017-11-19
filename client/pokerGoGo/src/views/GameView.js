/**
 * Created by WhelaJoy on 2017/3/11.
 */
var GameView = (function (_super){
	function GameView(){
		GameView.super(this);
		this.init();
	}
	Laya.class(GameView,"GameView",_super);

	GameView.LinesPoint = [
		Point.p(0,0),
		Point.p(50,0),
		Point.p(50,100),
		Point.p(-50,100),
		Point.p(-50,0),
		Point.p(0,0),
	];

	GameView.prototype.init = function() {
		this._sp = new Laya.Sprite();
		this.addChild(this._sp);
		this._sp.graphics.drawLines(100, 100 , [0
			,0,50,0,50,100,-50,100,-50,0,0,0], "#00FF00", 3);

		this._length = 0;
		this.initEvent();
	};

	GameView.prototype.getLinesPointInfo = function (list,length){
		var StartInfo = this.getStartPointAndIndex(list,length);
		var array = [];

		array.push(StartInfo.point.x);
		array.push(StartInfo.point.y);

		for (var i = StartInfo.index ; i < list.length ; i++){
			array.push(list[i].x);
			array.push(list[i].y);
		}

		return {Array : array};
	};

	GameView.prototype.getStartPointAndIndex = function(list,length){
		
		for (var i = 0 ; i < list.length ; i++){
			var point1 = list[i];
			var point2 = list[i + 1];
			if(!point2){
				break;
			}
			var distance = Point.pDistance(point1,point2);
			if (length <= distance){
				var point = Point.pAdd( point1 , Point.pMult(Point.pNormalize(Point.pSub(point2,point1)), length) );
				return {point:point,index : i + 1};
			}
			length -= distance;
		}

		return {point:list[list.length - 1]};
	};

	GameView.prototype.initEvent = function() {
		this.btnBetOn.on(Laya.Event.CLICK,this,this.onClickBetOn);
	};

	GameView.prototype.onClickBetOn = function() {
		var self = this;
		Laya.timer.frameLoop(1,this,function (){
			var delta = Laya.timer.delta/1000;
			self._length++;
			var pointInfo = self.getLinesPointInfo(GameView.LinesPoint,self._length);
			self._sp.graphics.clear();
			self._sp.graphics.drawLines(100, 100 ,pointInfo.Array, "#00FF00", 3);

		})
	};
	return GameView
})(GameViewUI);