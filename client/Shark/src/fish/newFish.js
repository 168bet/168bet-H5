var Fish = (function(_super) {

	function Fish (instance,id) {
		Fish.super(this);

		this.id = id;

		this.instance = instance;

		this.boundInfo = this.instance.frames[0].getBounds();
		this.instance.pivotX = this.boundInfo.width/2;
		this.instance.pivotY = this.boundInfo.height/2;
		this.addChild(this.instance);

		//this.init();

	};

	Laya.class(Fish, "Fish", _super);

	var __proto = Fish.prototype;

	__proto.play = function(start,loop,name) {
		this.instance.play(start,loop,name);
	};

	__proto.init = function(props)
	{
		this.moving = true;		// 移动
		this.isFree = true;
		this.underEat = null;
		this.speed = 1.2;
		this.originSpeed = 1.2;
		this.evilShark = null;
		this.frameAngelStep = 0.5;
		this.targetAngle = 0;

		this.getNewPathList();
	};

	__proto.swim = function() {
		this.update();
	};

	__proto.getNewPathList = function() {

		var startPos = {x:this.x, y:this.y};

		var endPos = this.calculationEndPos();
		//console.log("endpos.x = " + endPos.x + " endpos.y = " + endPos.y + " this.rotation = " + this.rotation);

		var distance = Point.pDistance(endPos,startPos);
		var trunAngle = this.calculationAngle(endPos,startPos,distance,this.rotation);

		this._destRotation = this.refreshFishAngle(trunAngle,endPos);
		this.endPos = endPos;
		this.setDirection(this.rotation);
	};

	__proto.calculationEndPos = function() {

		// 知道当前朝向的角度
		var currentDirectionAngle = this.rotation;

		// 转换成顺时针角度
		currentDirectionAngle = Math.round(this.getPositiveAngle(currentDirectionAngle));

		if(currentDirectionAngle > 360)
		{
			currentDirectionAngle = 360 - currentDirectionAngle;
		}

		// 与90度相差多少度
		var offset90L;
		var offset90R;
		var maxBoundaryX;
		var minBoundaryX;
		var maxBoundaryY;
		var minBoundaryY;
		var endPos = {x:0, y:0};
		var boundaryAngle;

		//var Fish.ScreenMinW = 100;
		//var Fish.ScreenMaxW = 1200;
		//var Fish.ScreenMinH = 110;
		//var Fish.ScreenMaxH = 700;

		if(currentDirectionAngle < 90)
		{
			offset90R = 90 - currentDirectionAngle;
			offset90L = currentDirectionAngle;

			boundaryAngle = offset90R;

			maxBoundaryX = Fish.ScreenMaxW;
			maxBoundaryY = Fish.ScreenMaxH;

			minBoundaryX = this.x - ((Fish.ScreenMaxH - this.y)*Math.tan(3.14159265/180*offset90L));
			if(minBoundaryX < Fish.ScreenMinW)
			{
				minBoundaryX = Fish.ScreenMinW;
			}

			endPos.x = Math.round(this.getRandom(maxBoundaryX,minBoundaryX));

			minBoundaryY = Fish.ScreenMaxH - Math.tan(3.14159265/180*boundaryAngle)*endPos.x;

			if(minBoundaryY < Fish.ScreenMinH)
			{
				minBoundaryY = Fish.ScreenMinH
			}
		}
		else if(currentDirectionAngle > 90 && currentDirectionAngle < 180)
		{
			// 左方向90度差值
			offset90L = 90 - (180 - currentDirectionAngle);

			// 右方向90度差值
			offset90R = (180 - currentDirectionAngle);

			boundaryAngle = offset90L;

			maxBoundaryX = this.x + ((Fish.ScreenMaxH - this.y)*Math.tan(3.14159265/180*offset90R));
			if(maxBoundaryX > Fish.ScreenMaxW)
			{
				maxBoundaryX = Fish.ScreenMaxW;
			}

			maxBoundaryY = Fish.ScreenMaxH;
			minBoundaryX = Fish.ScreenMinH;

			endPos.x = Math.round(this.getRandom(maxBoundaryX,minBoundaryX));

			minBoundaryY = Fish.ScreenMaxH - Math.tan(3.14159265/180*boundaryAngle)*endPos.x;
			if(minBoundaryY < Fish.ScreenMinH)
			{
				minBoundaryY = Fish.ScreenMinH;
			}
		}
		else if(currentDirectionAngle > 180 && currentDirectionAngle < 270)
		{
			offset90R = 90 - (270 - currentDirectionAngle);
			offset90L = 270 - currentDirectionAngle;

			boundaryAngle = offset90L;

			minBoundaryX = Fish.ScreenMinW;
			minBoundaryY = Fish.ScreenMinH;

			maxBoundaryX = this.x + (this.y * Math.tan(3.14159265/180*offset90R));
			if(maxBoundaryX > Fish.ScreenMaxW)
			{
				maxBoundaryX = Fish.ScreenMaxW;
			}
			endPos.x = Math.round(this.getRandom(maxBoundaryX,minBoundaryX));

			maxBoundaryY = Math.tan(3.14159265/180*boundaryAngle)*endPos.x;

			if(maxBoundaryY > Fish.ScreenMaxH)
			{
				maxBoundaryY = Fish.ScreenMaxH;
			}
		}
		else if(currentDirectionAngle > 270 && currentDirectionAngle < 360)
		{
			offset90R = 90 - (360 - currentDirectionAngle);
			offset90L = 360 - currentDirectionAngle;

			boundaryAngle = offset90R;

			maxBoundaryX = Fish.ScreenMaxW;
			minBoundaryY = Fish.ScreenMinH;

			minBoundaryX = this.x - (this.y*Math.tan(3.14159265/180*offset90L));
			if(minBoundaryX < Fish.ScreenMinW)
			{
				minBoundaryX = Fish.ScreenMinW;
			}

			endPos.x = Math.round(this.getRandom(maxBoundaryX,minBoundaryX));

			maxBoundaryY = Math.tan(3.14159265/180*boundaryAngle)*endPos.x;
			if(maxBoundaryY > Fish.ScreenMaxH)
			{
				maxBoundaryY = Fish.ScreenMaxH;
			}
		}
		else if(currentDirectionAngle == 0 || currentDirectionAngle == 360)
		{
			maxBoundaryX = Fish.ScreenMaxW;
			minBoundaryX = this.x;

			maxBoundaryY = Fish.ScreenMaxH;
			minBoundaryY = Fish.ScreenMinH;
			endPos.x = Math.round(this.getRandom(maxBoundaryX,minBoundaryX));
		}
		else if(currentDirectionAngle == 90)
		{
			maxBoundaryX = Fish.ScreenMaxW;
			minBoundaryX = Fish.ScreenMinW;

			maxBoundaryY = Fish.ScreenMaxH;
			minBoundaryY = this.y;
			endPos.x = Math.round(this.getRandom(maxBoundaryX,minBoundaryX));
		}
		else if(currentDirectionAngle == 180)
		{
			maxBoundaryX = this.x;
			minBoundaryX = Fish.ScreenMinW;

			maxBoundaryY = Fish.ScreenMaxH;
			minBoundaryY = Fish.ScreenMinH;
			endPos.x = Math.round(this.getRandom(maxBoundaryX,minBoundaryX));
		}
		else if(currentDirectionAngle == 270)
		{
			maxBoundaryX = Fish.ScreenMaxW;
			minBoundaryX = Fish.ScreenMinW;

			maxBoundaryY = this.y;
			minBoundaryY = Fish.ScreenMinH;
			endPos.x = Math.round(this.getRandom(maxBoundaryX,minBoundaryX));
		}

		//console.log("maxBoundaryY = " + maxBoundaryY + " minBoundaryY = " + minBoundaryY);
		endPos.y = Math.round(this.getRandom(maxBoundaryY,minBoundaryY));
		//console.log("endPos.y = " + endPos.y);

		return endPos;

	};

	__proto.changeDirection = function(dir)
	{
		if(dir != undefined)
		{
			this.setDirection(dir);
		}else
		{
			var dir = Math.random() > 0.5 ? 1 : -1;
			var degree = Math.random()*10 + 20 >> 0;
			this._destRotation = this.rotation + degree * dir >> 0;
		}

		var fps = 60, min = fps, max = fps * 3;
		this.changeDirCounter = Math.random()*(max - min + 1) + min >> 1;
	};

	__proto.setDirection = function(dir)
	{
		if(this.rotation == dir && this.speedX != undefined) return;

		if(dir.degree == undefined)
		{
			var radian = 3.14159265/180 * dir;
			dir = {degree:dir, sin:Math.sin(radian), cos:Math.cos(radian)};
		}

		this.rotation = dir.degree % 360;
		this.direction = this.getDirection(this.rotation);

		if(!this.underEat && this.evilShark)
		{
			var distance = Point.pDistance({x:this.x,y:this.y} , {x:this.evilShark.x,y:this.evilShark.y});
			var percentDistance = (distance/this.startDistanceFromShrak)*100;
			if(percentDistance < 30)
			{
				this.speed = 5;
			}
			else
			{
				this.speed -= 0.1;
				if(this.speed <= this.originSpeed)
				{
					this.speed = this.originSpeed
				}
			}
		}

		this.speedX = this.speed * dir.cos;
		this.speedY = this.speed * dir.sin;
	};

	__proto.update = function()
	{
		//move ahead
		if(this.moving)
		{
			this.x += this.speedX;
			this.y += this.speedY;
		}

		var flag = false;
		if(this.x < Fish.ScreenMinW)
		{
			this.x = Fish.ScreenMinW;
			flag = true;
		}
		else if(this.x > Fish.ScreenMaxW)
		{
			this.x = Fish.ScreenMaxW;
			flag = true;
		}

		if(this.y < Fish.ScreenMinH)
		{
			this.y = Fish.ScreenMinH;
			flag = true;
		}
		else if(this.y > Fish.ScreenMaxH)
		{
			this.y = Fish.ScreenMaxH;
			flag = true;
		}

		//change direction
		if(this._destRotation != null) {
			var delta = this._destRotation - this.rotation;
			this.frameAngelStep = 0.5;
			if(flag)
			{
				this.frameAngelStep = 2;
			}
			var realStep = delta > 0 ? this.frameAngelStep : -this.frameAngelStep;
			var r = this.rotation + realStep;

			if(delta == 0 ||
				(realStep > 0 && r >= this._destRotation) ||
				(realStep < 0 && r <= this._destRotation))
			{
				this.setDirection(this._destRotation);
				this._destRotation = null;
				this.moveDistance = this.calMoveDistance();
				this.lastPos = {x:this.x,y:this.y};
			}else
			{
				this.setDirection(r);
			}

		} else {
			if(Point.pDistance({x:this.x,y:this.y},this.lastPos) >= this.moveDistance)
			{
				this.getNewPathList();
			}
		}
	};

	__proto.checkEvilSharkClose = function() {
		if(this.evilShark)
		{
			var distanceFromShark = Point.pDistance({x:this.x,y:this.y},{x:this.evilShark.x,y:this.evilShark.y});
			if(distanceFromShark < 100)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		return false;
	};

	__proto.calRunPathList = function() {

	};

	__proto.isOutOfScreen = function()
	{
		if(this.x < -this.boundInfo.width/2 ||
			this.x > 1440 + this.boundInfo.width/2 ||
			this.y < -this.boundInfo.height/2 ||
			this.y > 900 + this.boundInfo.height/2)
		{
			return true;
		}else if(this.x > 0 && this.x < 1440 && this.y > 0 && this.y < 900)
		{
			return false;
		}
		return false;
	};

	__proto.loadAtlas = function(url,loaded,cacheName) {
		this.instance.loadAtlas(url,loaded,cacheName);
		this.boundInfo = this.instance.frames[0].getBounds();
		this.instance.pivotX = this.boundInfo.width/2;
		this.instance.pivotY = this.boundInfo.height/2;
	};

	__proto.dispose = function() {
		this.isFree = true;
		this.underEat = null;
		this.isDeath = true;
	};

	__proto.setFree = function() {
		this.isFree = false;
		this.isDeath = false;
	};

	__proto.getIsFree = function() {
		return this.isFree;
	};

	__proto.getUnderEat = function() {
		return this.underEat;
	};

	__proto.getId = function() {
		return this.id;
	};

	__proto.getBoundInfo = function() {
		return this.boundInfo;
	};

	__proto.setGray = function(target) {
		if(target)
		{
			var grayscaleMat = [0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0];
			var grayscaleFilter = new Laya.ColorFilter(grayscaleMat);
			this.filters = [grayscaleFilter];
		}
		else
		{
			this.filters = null;
		}
	};

	__proto.setSpeed = function(speed) {
		this.speed = speed;
		this.originSpeed = this.speed;
	};

	__proto.setEvilShark = function(shark) {
		this.evilShark = shark;
	};

	__proto.getPositiveAngle = function(angle) {
		var currentAngle = angle;
		var tempAngle = Math.abs(currentAngle);
		if(currentAngle < 0)
		{
			tempAngle = 360 + currentAngle;
		}
		return tempAngle;
	};

	__proto.getRandom = function(max,min) {
		return min + Math.round(Math.random() * (max - min)) - 1;
	};

	__proto.calculationAngle = function(targetPos,ownPos,distance,rotation) {
		var offset = Math.abs(targetPos.y - ownPos.y);
		var moveAngle;
		if(offset == 0)
		{
			if(targetPos.x > ownPos.x)
			{
				moveAngle = 0;
			}
			else if(targetPos.x < ownPos.x)
			{
				moveAngle = 180;
			}
			else if(targetPos.x == ownPos.x)
			{
				moveAngle = rotation;
			}
		}
		else
		{
			moveAngle = (180/3.14159265)*(Math.asin(offset/distance));
		}

		return moveAngle;
	};

	__proto.refreshFishAngle = function(angle,targetPos) {
		if(targetPos.x < this.x && targetPos.y > this.y)
		{
			// 左下
			this.targetAngle = 180  - angle;
		}
		else if(targetPos.x > this.x && targetPos.y > this.y)
		{
			// 右下
			this.targetAngle = angle;
		}
		else if(targetPos.x > this.x && targetPos.y < this.y)
		{
			// 右上
			this.targetAngle = -angle;
		}
		else if(targetPos.x < this.x && targetPos.y < this.y)
		{
			// 左上
			this.targetAngle = 180 + angle;
		}
		else if(targetPos.x > this.x && targetPos.y == this.y)
		{
			// 右
			this.targetAngle = 0;
		}
		else if(targetPos.x < this.x && targetPos.y == this.y)
		{
			// 左
			this.targetAngle = 180;
		}
		else if(targetPos.x == this.x && targetPos.y > this.y)
		{
			// 下
			this.targetAngle = 90;
		}
		else if(targetPos.x == this.x && targetPos.y < this.y)
		{
			// 上
			this.targetAngle = 270;
		}
		else if(targetPos.x == this.x && targetPos.y == this.y)
		{
			this.targetAngle = this.rotation;
		}

		return this.targetAngle;
	};

	__proto.getDirection = function(angle) {

		var direction;
		var currentAngle = angle;
		var tempAngle = Math.abs(currentAngle);
		if(currentAngle < 0)
		{
			tempAngle = 360 + currentAngle;
		}

		if(tempAngle > 0 && tempAngle < 90)
		{
			direction = Fish.Direction.RightDown;
		}
		else if(tempAngle > 90 && tempAngle < 180)
		{
			direction = Fish.Direction.LeftDown;
		}
		else if(tempAngle > 180 && tempAngle < 270)
		{
			direction = Fish.Direction.LeftUp;
		}
		else if(tempAngle > 270 && tempAngle < 360)
		{
			direction = Fish.Direction.RightUp;
		}
		else if(tempAngle == 0)
		{
			direction = Fish.Direction.Right;
		}
		else if(tempAngle == 180)
		{
			direction = Fish.Direction.Left;
		}
		else if(tempAngle == 90)
		{
			direction = Fish.Direction.Down;
		}
		else if(tempAngle == 270)
		{
			direction = Fish.Direction.up;
		}

		return direction;
	};

	__proto.calMoveDistance = function() {
		var offsetX,offsetY;
		var resutlDistance;

		var fixDistance = this.boundInfo.width/2;

		switch (this.direction)
		{
			case Fish.Direction.Right:
				offsetX = Fish.ScreenMaxW - this.x;
				resutlDistance = offsetX;
				break;
			case Fish.Direction.RightDown:
				offsetX = Fish.ScreenMaxW - this.x;
				offsetY = Fish.ScreenMaxH - this.y;
				if(offsetX > offsetY)
				{
					resutlDistance = offsetY;
				}
				else if(offsetX <= offsetY)
				{
					resutlDistance = offsetX;
				}
				break;
			case Fish.Direction.Down:
				offsetY = Fish.ScreenMaxH - this.y;
				resutlDistance = offsetY;
				break;
			case Fish.Direction.LeftDown:
				offsetX = this.x - Fish.ScreenMinW;
				offsetY = Fish.ScreenMaxH - this.y;
				if(offsetX > offsetY)
				{
					resutlDistance = offsetY;
				}
				else if(offsetX <= offsetY)
				{
					resutlDistance = offsetX;
				}
				break;
			case Fish.Direction.Left:
				offsetX = this.x - Fish.ScreenMinW;
				resutlDistance = offsetX;
				break;
			case Fish.Direction.LeftUp:
				offsetX = this.x - Fish.ScreenMinW;
				offsetY = this.y - Fish.ScreenMinH;
				if(offsetX > offsetY)
				{
					resutlDistance = offsetY;
				}
				else if(offsetX <= offsetY)
				{
					resutlDistance = offsetX;
				}
				break;
			case Fish.Direction.Up:
				offsetY = this.y - Fish.ScreenMinH;
				resutlDistance = offsetY;
				break;
			case Fish.Direction.RightUp:
				offsetX = Fish.ScreenMaxW - this.x;
				offsetY = this.y - Fish.ScreenMinH;
				if(offsetX > offsetY)
				{
					resutlDistance = offsetY;
				}
				else if(offsetX <= offsetY)
				{
					resutlDistance = offsetX;
				}
				break;
		}


		var retPosY = resutlDistance*Math.sin((3.14159265/180 * this.rotation));
		var retPosX = resutlDistance*Math.cos((3.14159265/180 * this.rotation));

		if(retPosY < Fish.ScreenMinH || retPosY > Fish.ScreenMaxH || retPosX < Fish.ScreenMinW || retPosX > Fish.ScreenMaxW)
		{
			return 0;
		}
		else
		{
			return resutlDistance;
		}

		//if(resutlDistance > fixDistance)
		//{
		//	resutlDistance = fixDistance;
		//}
	};

	__proto.eat = function(food) {
		var self = this;
		food.underEat = this;

		var foodPoint = {x:food.x,y:food.y};
		var distance = Point.pDistance({x:food.x,y:food.y} , {x:this.x,y:this.y});
		var turnAngle = this.calculationAngle(foodPoint,{x:this.x,y:this.y},distance,this.rotation);
		var realAngle = this.refreshFishAngle(turnAngle,foodPoint);

		var rotate = Sequence.create([
			RotateTo.create(0.3,realAngle),
			CallFunc.create(Laya.Handler.create(this,function(){
				self.timer.frameLoop(1,self,self.frameEat);
			}))
		]);

		App.actionManager.addAction(rotate, this);

		self.playEat = false;
		self.foodDeath = false;
		var startDistance = Point.pDistance({x:food.x,y:food.y},{x:self.x, y:self.y});

		this.frameEat = function(){
			self.speed = 8;

			var startPos = {x:self.x, y:self.y};

			var endPos;
			var distance;
			var trunAngle;
			var realAngle;
			var percentDistance;

			if(!self.foodDeath)
			{
				endPos = {x:food.x,y:food.y};
				distance = Point.pDistance(endPos,startPos);
				trunAngle = self.calculationAngle(endPos,startPos,distance,self.rotation);
				realAngle = self.refreshFishAngle(trunAngle,endPos);
				percentDistance = (distance/startDistance)*100;
				if(percentDistance <= 30)
				{
					self.speed = 10;
				}

				self.sharkRealAngle = realAngle;

				if(percentDistance < 50)
				{
					food.speed = 5;
				}

				if(percentDistance >= 10 && percentDistance < 25 && !self.playEat)
				{
					self.playEat = true;
					self.play(0,false,"1017eat");
					self.interval = 10;
				}
				else if(percentDistance < 10)
				{
					self.play(0,true,"1017");
					self.interval = 100;
					self.event(Fish.Event.Eated,[self.name,food]);
					self.foodDeath = true;
				}

			}
			else
			{
				realAngle = self.sharkRealAngle;
				self.speed = 8;
				if(self.isOutOfScreen())
				{
					self.timer.clear(self,self.frameEat);
					self.event(Fish.Event.NextEat,[self]);
				}
			}

			var radian = 3.14159265/180 * realAngle;

			self.rotation = realAngle % 360;

			self.x += (self.speed * Math.cos(radian));
			self.y += (self.speed * Math.sin(radian));

		};
	};

	__proto.cleatFrameEat = function() {
		if(this.frameEat)
		{
			this.timer.clear(this,this.frameEat);
		}
	};

	__proto.setStartDistance = function(distance) {
		this.startDistanceFromShrak = distance;
	};

	Fish.Direction = {};
	Fish.Direction.Right = 1;
	Fish.Direction.RightDown = 2;
	Fish.Direction.RightUp = 3;
	Fish.Direction.Down = 4;
	Fish.Direction.LeftDown = 5;
	Fish.Direction.Left = 6;
	Fish.Direction.LeftUp = 7;
	Fish.Direction.Up = 8;


	Fish.Event = {};
	Fish.Event.Eated = "eated";
	Fish.Event.NextEat = "nextEated";
	Fish.Event.SharkCome = "sharkCome";
	Fish.Event.SharkLeave = "sharkLeave";

	Fish.ScreenMaxH = 700;
	Fish.ScreenMinH = 110;
	Fish.ScreenMaxW = 1300;
	Fish.ScreenMinW = 50;



	return Fish;
})(Laya.Sprite);