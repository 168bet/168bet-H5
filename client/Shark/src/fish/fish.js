var Fish = (function(_super) {
    function Fish(instance,id,resourcePath) {
        Fish.super(this);
        this.id = id;

        this.instance = instance;

        this.resourcePath = resourcePath;

        this.init();

        this.initEvent();

    }
    Laya.class(Fish, "Fish", _super);

    var __proto = Fish.prototype;

    __proto.initEvent = function() {
    };

    __proto.removeEvent = function() {
    };

    __proto.init = function() {
        var boundBox = this.instance.frames[0].getBounds();

        this.boundInfo = boundBox;

        this.instance.pivotX = boundBox.width/2;
        this.instance.pivotY = boundBox.height/2;
        this.addChild(this.instance);

        this.isFree = true;
        this.underEat = null;
        this.speed = 1.5;
        this.oneStepTime = 0;   // 移动一个格子所需的时间
        this.pathList = [];

        this.targetAngle = 0;
        this.isDeath = false;

        this.textLabel = new Laya.Label();
        this.textLabel.text = "ta"+ Math.round(this.targetAngle) + " ca"+ Math.round(this.rotation);
        this.textLabel.color = "#ffffff";
        this.textLabel.fontSize = 30;
        //this.addChild(this.textLabel);

        this.frameTimes = 0;
    };

    __proto.initBornPath = function() {
        var endPos;
        var distance;
        var angle = this.rotation;
        var offsetY,offsetX;
        var maxDistance = 400;
        var minDistance = 200;
        distance = minDistance + Math.round(Math.random() * (maxDistance - minDistance)) - 1;
        offsetY = distance*Math.sin(3.14159265/180*angle);
        offsetX = distance*Math.cos(3.14159265/180*angle);
        endPos = this.getRowCol(this.x + offsetX, this.y + offsetY);
        var startPos = this.getRowCol(this.x, this.y);

        this.pathList = Shark.pathMgr2.findWay(startPos ,endPos);
        this.hadNewPathList = true;
        this.moveDistance = 0;
    };

    __proto.play = function(start,loop,name) {
        this.instance.play(start,loop,name);
    };

    __proto.loadAtlas = function(url,loaded,cacheName) {
        this.instance.loadAtlas(url,loaded,cacheName);
        this.boundInfo = this.instance.frames[0].getBounds();
        this.instance.pivotX = this.boundInfo.width/2;
        this.instance.pivotY = this.boundInfo.height/2;
    };

    __proto.getRandom = function(max,min) {
        return min + Math.round(Math.random() * (max - min)) - 1;
    };

    __proto.getRowCol = function(x,y) {
        return {y:Math.floor(y/10), x:Math.floor(x/10)};
    };

    __proto.getNewPathList = function() {

        this.startPos = this.getRowCol(this.x, this.y);

        //var endPos = this.calculationEndPos();
        this.endPos = {x:0,y:0};
        this.endPos.x = Math.round(this.getRandom(140,3));

        this.endPos.y = Math.round(this.getRandom(89,3));


        //this.pathList = Fishing.pathMgr2.findWay(startPos ,endPos);
        //
        //this.hadNewPathList = true;
        //this.moveDistance = 0;
        //if(this.pathList && this.pathList.length > 0)
        //{
        //    this.swim();
        //}
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
        if(currentDirectionAngle < 90)
        {
            offset90R = 90 - currentDirectionAngle;
            offset90L = currentDirectionAngle;

            boundaryAngle = offset90R;

            maxBoundaryX = 1400;
            maxBoundaryY = 890;

            //minBoundaryY = this.y - ((1400 - this.x)*Math.tan(3.14159265/180*offset90R));
            //if(minBoundaryY < 0)
            //{
            //    minBoundaryY = 30
            //}

            minBoundaryX = this.x - ((890 - this.y)*Math.tan(3.14159265/180*offset90L));
            if(minBoundaryX < 0)
            {
                minBoundaryX = 30;
            }

            endPos.x = Math.round(this.getRandom(Math.round(maxBoundaryX/10),Math.round(minBoundaryX/10)));

            minBoundaryY = 890 - (Math.tan(3.14159265/180*boundaryAngle)*endPos.x * 10);

            if(minBoundaryY < 0)
            {
                minBoundaryY = 30
            }

            //console.log("90 minBoundaryY = " + minBoundaryY + " maxBoundaryY = " + maxBoundaryY);

        }
        else if(currentDirectionAngle > 90 && currentDirectionAngle < 180)
        {
            // 左方向90度差值
            offset90L = 90 - (180 - currentDirectionAngle);

            // 右方向90度差值
            offset90R = (180 - currentDirectionAngle);

            boundaryAngle = offset90L;

            //minBoundaryY = this.y - (this.x*Math.tan(3.14159265/180*offset90L));
            //if(minBoundaryY < 0)
            //{
            //    minBoundaryY = 30;
            //}

            maxBoundaryX = this.x + ((890 - this.y)*Math.tan(3.14159265/180*offset90R));
            if(maxBoundaryX > 1400)
            {
                maxBoundaryX = 1400;
            }

            maxBoundaryY = 890;
            minBoundaryX = 30;

            endPos.x = Math.round(this.getRandom(Math.round(maxBoundaryX/10),Math.round(minBoundaryX/10)));

            minBoundaryY = 890 - (Math.tan(3.14159265/180*boundaryAngle)*endPos.x * 10);
            if(minBoundaryY < 0)
            {
                minBoundaryY = 30;
            }
            //console.log("180 minBoundaryY = " + minBoundaryY + " maxBoundaryY = " + maxBoundaryY);
        }
        else if(currentDirectionAngle > 180 && currentDirectionAngle < 270)
        {
            offset90R = 90 - (270 - currentDirectionAngle);
            offset90L = 270 - currentDirectionAngle;

            boundaryAngle = offset90L;
            minBoundaryX = 30;
            minBoundaryY = 30;

            maxBoundaryX = this.x + (this.y * Math.tan(3.14159265/180*offset90R));
            if(maxBoundaryX > 1400)
            {
                maxBoundaryX = 1400;
            }

            //maxBoundaryY = this.y + (this.x * Math.tan(3.14159265/180*offset90L));
            //if(maxBoundaryY > 890)
            //{
            //    maxBoundaryY = 890;
            //}

            endPos.x = Math.round(this.getRandom(Math.round(maxBoundaryX/10),Math.round(minBoundaryX/10)));

            maxBoundaryY = (Math.tan(3.14159265/180*boundaryAngle)*endPos.x) * 10;

            if(maxBoundaryY > 890)
            {
                maxBoundaryY = 890;
            }
            //console.log("270 minBoundaryY = " + minBoundaryY + " maxBoundaryY = " + maxBoundaryY);
        }
        else if(currentDirectionAngle > 270 && currentDirectionAngle < 360)
        {
            offset90R = 90 - (360 - currentDirectionAngle);
            offset90L = 360 - currentDirectionAngle;

            boundaryAngle = offset90R;

            maxBoundaryX = 1400;
            minBoundaryY = 30;

            //maxBoundaryY = this.y + ((1400 - this.x) * Math.tan(3.14159265/180*offset90R));
            //if(maxBoundaryY > 890)
            //{
            //    maxBoundaryY = 890;
            //}

            minBoundaryX = this.x - (this.y*Math.tan(3.14159265/180*offset90L));
            if(minBoundaryX < 0)
            {
                minBoundaryX = 30;
            }

            endPos.x = Math.round(this.getRandom(Math.round(maxBoundaryX/10),Math.round(minBoundaryX/10)));

            maxBoundaryY = (Math.tan(3.14159265/180*boundaryAngle)*endPos.x) * 10;
            if(maxBoundaryY > 890)
            {
                maxBoundaryY = 890;
            }
            //console.log("360 minBoundaryY = " + minBoundaryY + " maxBoundaryY = " + maxBoundaryY);
        }
        else if(currentDirectionAngle == 0 || currentDirectionAngle == 360)
        {
            maxBoundaryX = 1400;
            minBoundaryX = this.x;

            maxBoundaryY = 890;
            minBoundaryY = 30;
            endPos.x = Math.round(this.getRandom(Math.round(maxBoundaryX/10),Math.round(minBoundaryX/10)));
        }
        else if(currentDirectionAngle == 90)
        {
            maxBoundaryX = 1400;
            minBoundaryX = 30;

            maxBoundaryY = 890;
            minBoundaryY = this.y;
            endPos.x = Math.round(this.getRandom(Math.round(maxBoundaryX/10),Math.round(minBoundaryX/10)));
        }
        else if(currentDirectionAngle == 180)
        {
            maxBoundaryX = this.x;
            minBoundaryX = 30;

            maxBoundaryY = 890;
            minBoundaryY = 30;
            endPos.x = Math.round(this.getRandom(Math.round(maxBoundaryX/10),Math.round(minBoundaryX/10)));
        }
        else if(currentDirectionAngle == 270)
        {
            maxBoundaryX = 1400;
            minBoundaryX = 30;

            maxBoundaryY = this.y;
            minBoundaryY = 30;
            endPos.x = Math.round(this.getRandom(Math.round(maxBoundaryX/10),Math.round(minBoundaryX/10)));
        }

        //endPos.x = Math.round(this.getRandom(Math.round(maxBoundaryX/10),Math.round(minBoundaryX/10)));

        endPos.y = Math.round(this.getRandom(Math.round(maxBoundaryY/10),Math.round(minBoundaryY/10)));


        console.log("endPos.x = " + endPos.x + " endPos.y = " + endPos.y + " currentDirectionAngle = " + currentDirectionAngle);
        //console.log("currentDirectionAngle = " + currentDirectionAngle);
        return endPos;

    };


    __proto.swim = function(){

        App.actionManager.removeAllActions(this);

        //var startPos = this.getRowCol(this.x, this.y);
        var startPos = {x:this.x, y:this.y};

        //var endPos = this.calculationEndPos();
        var endPos = {x:0,y:0};
        endPos.x = Math.round(this.getRandom(1400,30));

        endPos.y = Math.round(this.getRandom(870,30));

        var distance = Point.pDistance(endPos,startPos);
        var trunAngle = this.calculationAngle(endPos,startPos,distance,this.rotation);
        var realAngle = this.refreshFishAngle(trunAngle,endPos);

        var time = distance/this.speed;
        this.oneStepTime = time/60;
        var self = this;
        this.sequence = Sequence.create([
            Spawn.create([
                MoveTo.create(this.oneStepTime,endPos),
                RotateTo.create(this.oneStepTime/10,realAngle)
            ]),
            CallFunc.create(Laya.Handler.create(this, function(){
                if(!self.isDeath)
                {
                    self.sequence = null;
                    self.swim();
                }

            })),
        ])
        App.actionManager.addAction(this.sequence, this);

        //this.calAdditionalPos();
        //this.calAdditionalPos2();

        //this.frameTimes += 1;
        //if(this.pathList.length == 0)
        //{
        //    this.hadNewPathList = false;
        //}
    };

    __proto.calAdditionalPos2 = function() {
        if(this.pathList.length == 0)
        {
            //this.hadNewPathList = false;
            this.getNewPathList();
        }
        else
        {
            var self = this;
            //console.log("this.rotation = " + this.rotation);
            var data = this.getTargetPos();

            this.targetPos = this.transDescartesPos(data.targetPos);
            this.targetAngle = data.targetAngle;
            this.textLabel.text = "ta"+ Math.round(this.targetAngle) + " ca"+ Math.round(this.rotation);
            //console.log("targetAngle = " + Math.round(this.targetAngle) + " currentAngle = " + Math.round(this.rotation));
            //this.refreshFishAngle(this.moveAngle,this.targetPos);
            this.moveDistance = Point.pDistance({x:this.x, y:this.y},this.targetPos);
            var time = this.moveDistance/this.speed;
            this.oneStepTime = time/60;
            var offsetAngle = Math.abs(this.targetAngle - this.rotation);
            //console.log("offsetAngle = " + offsetAngle + " this.targetAngle = " + this.targetAngle + " this.rotation = " + this.rotation);
            //console.log("this.oneStepTime = " + this.oneStepTime + " this.moveDistance = " + this.moveDistance + " time = " + time);

            if(Math.round(offsetAngle) == 360)
            {
                this.targetAngle = this.rotation;
            }

            Shark.actionManager.removeAllActions(this);

            var sequence = Sequence.create([
                Spawn.create([
                    MoveTo.create(this.oneStepTime,this.targetPos),
                    RotateTo.create(this.oneStepTime,this.targetAngle)
                ]),
                CallFunc.create(Laya.Handler.create(this, function(){
                    self.calAdditionalPos2();
                })),
            ])
            App.actionManager.addAction(sequence, this);
        }

    };

    __proto.calSameAnglePointCount = function(lastTargetPos,lastMoveAngle) {

        var sameAngleCount = 0;
        var trunAngle;
        for(var index = 1 ; index < this.pathList.length ; index++)
        {
            var tempTargetPos = this.transDescartesPos(this.pathList[index]);
            var tempMoveDistance = Point.pDistance(tempTargetPos,lastTargetPos);
            var tempMoveAngle = this.calculationAngle(tempTargetPos,lastTargetPos,tempMoveDistance,lastMoveAngle);
            if(lastMoveAngle == tempMoveAngle)
            {
                lastMoveAngle = tempMoveAngle;
                lastTargetPos = tempTargetPos;
                sameAngleCount += 1;
            }
            else
            {

                break;
            }
        }

        //trunAngle = lastMoveAngle;

        return {"angleCount":sameAngleCount};

    };

    __proto.getTargetPos = function() {
        var lastTargetPos = this.transDescartesPos(this.pathList[0]);
        var lastMoveDistance = Point.pDistance({x:this.x, y:this.y},lastTargetPos);
        var lastMoveAngle = this.calculationAngle(lastTargetPos,{x:this.x, y:this.y},lastMoveDistance,this.rotation);
        var resultIndex = null;
        var trunAngle;
        var realAngle;
        if(this.rotation == lastMoveAngle)
        {
            lastMoveAngle = this.rotation;
            for(var index = 1 ; index < this.pathList.length ; index++)
            {
                //console.log("-----------------------------------");
                var tempTargetPos = this.transDescartesPos(this.pathList[index]);
                var tempMoveDistance = Point.pDistance(tempTargetPos,lastTargetPos);
                var tempMoveAngle = this.calculationAngle(tempTargetPos,lastTargetPos,tempMoveDistance,lastMoveAngle);
                if(lastMoveAngle == tempMoveAngle)
                {
                    lastMoveAngle = tempMoveAngle;
                    lastTargetPos = tempTargetPos;
                }
                else
                {
                    trunAngle = tempMoveAngle;
                    resultIndex = index;
                    break;
                }
            }
        }
        else
        {
            resultIndex = 0;
            trunAngle = lastMoveAngle;
        }

        if(resultIndex == null)
        {
            // for循环结束都没有结果，代表剩下的点都是同一个角度
            resultIndex = this.pathList.length - 1;
            trunAngle = lastMoveAngle;
        }

        var resultPos = this.pathList[resultIndex];
        this.pathList.splice(0,resultIndex+1);

        realAngle = this.refreshFishAngle(trunAngle,this.transDescartesPos(resultPos));
        return {targetPos:resultPos,targetAngle:realAngle};

    };

    // 计算每一帧的坐标增量，寻路算法是每10个像素为一点，即使用每帧移动也是过快
    __proto.calAdditionalPos = function() {
        if(this.moveDistance <= 0)
        {
            this.targetPos = this.transDescartesPos(this.pathList.shift());
            this.moveDistance = Point.pDistance({x:this.x, y:this.y},this.targetPos);
            this.calculationAngle();
            var radian = 3.14159265/180*this.moveAngle;
            this._offsetX = Math.cos(radian)*(this.speed);//Math.cos(moveAngle)*(0.016*this._speed);
            this._offsetY = this._offsetX*Math.tan(radian);
            this._Xscale = 1;
            this._Yscale = 1;

            if(this.x > this.targetPos.x)
                this._Xscale = -1;

            if(this.y > this.targetPos.y)
                this._Yscale = -1;

            this.moveFrameTime = this.moveDistance/this.speed;

            this.refreshFishAngle(this.moveAngle,this.targetPos);

        }
        else
        {
            this.lastPos = {x:this.x, y:this.y};
            this.x += this._offsetX * this._Xscale;
            this.y += this._offsetY * this._Yscale;
            this.moveDistance -= Point.pDistance({x:this.x,y:this.y},this.lastPos);

        }

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

        //if(targetPos.x < ownPos.x && targetPos.y > ownPos.y)
        //{
        //    // 左下
        //    realAngle = 180  - moveAngle;
        //}
        //else if(targetPos.x > ownPos.x && targetPos.y > ownPos.y)
        //{
        //    // 右下
        //    realAngle = moveAngle;
        //}
        //else if(targetPos.x > ownPos.x && targetPos.y < ownPos.y)
        //{
        //    // 右上
        //    realAngle = this.getPositiveAngle(-moveAngle);
        //}
        //else if(targetPos.x < ownPos.x && targetPos.y < ownPos.y)
        //{
        //    // 左上
        //    realAngle = 180 + moveAngle;
        //}
        //else if(targetPos.x > ownPos.x && targetPos.y == ownPos.y)
        //{
        //    // 右
        //    realAngle = 0;
        //}
        //else if(targetPos.x < ownPos.x && targetPos.y == ownPos.y)
        //{
        //    // 左
        //    realAngle = 180;
        //}
        //else if(targetPos.x == ownPos.x && targetPos.y > ownPos.y)
        //{
        //    // 下
        //    realAngle = 90;
        //}
        //else if(targetPos.x == ownPos.x && targetPos.y < ownPos.y)
        //{
        //    // 上
        //    realAngle = 270;
        //}
        //else if(targetPos.x == ownPos.x && targetPos.y == ownPos.y)
        //{
        //    realAngle = rotation;
        //}
        //
        //return Math.round(realAngle);
    };

    // 转换成实际坐标
    __proto.transDescartesPos = function(pos) {
        return {x:pos.x*10,y:pos.y*10};
    };

    // 刷新角度
    __proto.refreshFishAngle = function(angle,targetPos) {
        //var r = this.rotation;
        //var nowDirection = this.getDirection(this.rotation);
        //var targetDirection = this.getDirection(angle);
        //this.targetAngle = angle;
        //// 转化成顺时针方向角度
        //var targetPositiveAngle = this.getPositiveAngle(angle);
        //var ownPositiveAngle = this.getPositiveAngle(this.rotation);
        //
        //
        //// 求出两个角度相差的角度
        //var offsetAngle = Math.abs(ownPositiveAngle - targetPositiveAngle);
        //
        //// 再求出本身角度转到目标角度所需的距离角度(顺时针）
        //var distanceAngle = 360 - offsetAngle;
        //
        //if(this.rotation != angle)
        //{
        //    if(distanceAngle >= offsetAngle)
        //    {
        //        // 如果顺时针转过去需要的角度大，就逆时针旋转
        //        this.frameRotation = -(offsetAngle/this.moveFrameTime);
        //    }
        //    else if(distanceAngle < offsetAngle)
        //    {
        //        // 反之顺时针
        //        this.frameRotation = distanceAngle/this.moveFrameTime;
        //    }
        //    this.runRotation = true;
        //}
        //else
        //{
        //    this.runRotation = false;
        //}




        //if(this.rotation != angle)
        //{
        //
        //    var offsetAngle = Math.abs(ownPositiveAngle - targetPositiveAngle);
        //
        //    if(offsetAngle <= 180)
        //    {
        //        this.frameRotation = offsetAngle/this.moveFrameTime;
        //    }
        //    else if(offsetAngle > 180)
        //    {
        //        this.frameRotation = -(offsetAngle/this.moveFrameTime);
        //    }
        //    this.runRotation = true;
        //}
        //else
        //{
        //    this.runRotation = false;
        //}
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

        //var offsetAngle = this.targetAngle - this.rotation;

        return this.targetAngle;

        //if(targetPos.x < this.x && targetPos.y > this.y)
        //{
        //    // 左下
        //    var angle = 180  - angle;
        //    this.rotation = angle;
        //}
        //else if(targetPos.x > this.x && targetPos.y > this.y)
        //{
        //    // 右下
        //    this.rotation = angle;
        //}
        //else if(targetPos.x > this.x && targetPos.y < this.y)
        //{
        //    // 右上
        //    this.rotation = -angle;
        //}
        //else if(targetPos.x < this.x && targetPos.y < this.y)
        //{
        //    // 左上
        //    this.rotation = 180 + angle;
        //}
        //else if(targetPos.x > this.x && targetPos.y == this.y)
        //{
        //    // 右
        //    this.rotation = 0;
        //}
        //else if(targetPos.x < this.x && targetPos.y == this.y)
        //{
        //    // 左
        //    this.rotation = 180;
        //}
        //else if(targetPos.x == this.x && targetPos.y > this.y)
        //{
        //    // 下
        //    this.rotation = 90;
        //}
        //else if(targetPos.x == this.x && targetPos.y < this.y)
        //{
        //    // 上
        //    this.rotation = 270;
        //}
    };

    __proto.setSpeed = function(speed) {
        this.speed = speed;
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

    __proto.eat = function(food) {
        App.actionManager.removeAllActions(this);

        var self = this;
        food.underEat = this;

        var foodPoint = {x:food.x,y:food.y};
        var distance = Point.pDistance({x:food.x,y:food.y} , {x:this.x,y:this.y});
        var turnAngle = this.calculationAngle(foodPoint,{x:this.x,y:this.y},distance,this.rotation);
        var realAngle = this.refreshFishAngle(turnAngle,foodPoint);
        //this.rotation = realAngle;

        //tween && tween.clear();

        var complete = function() {
            self.event(Fish.Event.Eated,[self.name,food]);
        };

        var rotate = Sequence.create([
            RotateTo.create(0.3,realAngle),
            CallFunc.create(Laya.Handler.create(this,function(){
                var tween = Laya.Tween.to(self,
                    {
                        x: food.x,
                        y: food.y
                    }, 1500, Laya.Ease['sineOut'],Laya.Handler.create(null, complete));
            }))
        ]);

        App.actionManager.addAction(rotate, this);


        //var tween = Laya.Tween.to(this,
        //    {x:food.x,y:food.y,ease:Laya.Ease.sineOut,complete:Laya.Handler.create(this,complete)},1800);

        //var moveToEat = Sequence.create([
        //    MoveTo.create(1,foodPoint),
        //    CallFunc.create(Laya.Handler.create(this, function(){
        //        self.event(Fish.Event.Eated,[self.name,food]);
        //    })),
        //]);

        //App.actionManager.addAction(moveToEat, this);
    };


    Fish.Direction = {};
    Fish.Direction.Right = 1;
    Fish.Direction.RightDown = 2;
    Fish.Direction.Down = 3;
    Fish.Direction.LeftDown = 4;
    Fish.Direction.Left = 5;
    Fish.Direction.LeftUp = 6;
    Fish.Direction.Up = 7;
    Fish.Direction.RightUp = 8;

    Fish.Event = {};
    Fish.Event.Eated = "eated";

    return Fish;
})(Laya.Sprite);