var BattleView = (function(_super) {
    function BattleView(game) {
        BattleView.super(this);
        this.game = game;

    }

    Laya.class(BattleView, "BattleView", _super);

    var __proto=BattleView.prototype;

    __proto.init = function() {

        this.boxBottomIdle.zOrder = 100;
        this.boxCountDown.zOrder = 100;
        this.boxBottom.zOrder = 100;
        this.boxResultView.zOrder = 100;
        this.boxTop.zOrder = 100;
        this.goldLab.zOrder = 100;
        //this.betCount.zOrder = 100;
        this.betCount.visible = false;
        this.winReward.zOrder = 100;
        this.maskBg.zOrder = 101;

        //this.boxResultView.visible = false;
        //this.boxCountDown.visible = false;
        //this.boxes  = [
        //                this.boxBottomIdle,
        //                this.boxCountDown,
        //                this.boxBottom,
        //                this.boxResultView,
        //                this.boxTop];

        this.runNowBtn.visible = false;
        this.maskBg.visible = false;

        this.fishPool = [];
        this.selectFish = {};
        this.selectIndex = [];

        this.isRunningNow = false;

        this.battleController = new BattleController(this);

        var betBtnEffect =  new Laya.Animation();
        betBtnEffect.play(0,true,"lighter");
        betBtnEffect.blendMode = "lighter";
        betBtnEffect.interval = 100;
        betBtnEffect.x = this.changeBetBtn.x - 27;
        betBtnEffect.y = this.changeBetBtn.y - 27;
        betBtnEffect.zOrder = 0;
        this.boxBottom.addChild(betBtnEffect);

        this.runNowEffect = new Laya.Animation();
        this.runNowEffect.play(0,true,"runNowEffect");
        this.runNowEffect.blendMode = "lighter";
        this.runNowEffect.interval = 100;
        this.runNowEffect.pivotX = 106;
        this.runNowEffect.pivotY = 36;
        this.runNowEffect.x = this.runNowBtn.x;
        this.runNowEffect.y = this.runNowBtn.y;
        this.runNowEffect.zOrder = 0;
        this.boxCountDown.addChild(this.runNowEffect);
        this.runNowEffect.visible = false;

        //var betBtnEffect2 =  new Laya.Animation();
        //betBtnEffect2.play(0,true,"lighter");
        //betBtnEffect2.blendMode = "lighter";
        //betBtnEffect2.interval = 100;
        //betBtnEffect2.x = this.changeBetBtn.x - 20;
        //betBtnEffect2.y = this.changeBetBtn.y - 20;
        //this.boxBottom.addChild(betBtnEffect2);


        this.initBtnEvent();
        this.initShark();
        this.initView();
        this.viewReady();

    };

    __proto.onSetDataSource = function(obj) {
        //var box;
        //for(var index in this.boxes)
        //{
        //    box = this.boxes[index];
        //    box.dataSource = obj;
        //}
        this.dataSource = obj;
    };

    __proto.setBoxCountDownDataSource = function(obj) {
        this.boxCountDown.dataSource = obj;
    };

    __proto.onSetRecordHistory = function(gameTime,recordHistoryId) {
        var ani = new Laya.Animation();
        ani.loadAtlas("assets/ani/" + recordHistoryId + "/" + recordHistoryId + ".json",null,recordHistoryId);
        ani.interval = 100;
        ani.index = 0;
        var boundBox = ani.frames[0].getBounds();
        ani.pivotX = boundBox.width/2;
        ani.pivotY = boundBox.height/2;
        ani.play(0,true,recordHistoryId);
        var scale = this.calFishScale({width:60,height:60},{width:boundBox.width,height:boundBox.height});
        ani.scale(scale.x,scale.y);
        ani.pos(38.5,38.5);

        this["resultBg"+gameTime].addChild(ani);
    };

    __proto.onClearRecordHistory = function() {
        for(var i = 1 ; i < 17 ; i++)
        {
            this["resultBg"+i].removeChildren();
        }
    };

    // 创建10条被吃小鱼以及两条吃鱼的鲨鱼
    __proto.initFish = function(fishPool) {
        for(var index in fishPool)
        {
            var fish = this.newFish({
                id:fishPool[index].id,
                x:720,
                y:450,
                rotation:Math.round(Math.random() * (360)) - 1,
                zOrder:2,
                scaleX:fishPool[index].scale,
                scaleY:fishPool[index].scale,
                name:null,
                speed:fishPool[index].speed});
            fish.setEvilShark(this.shark1);
            this.addChild(fish);
            this.fishPool.push(fish);
        }

        this.shark1.pos(1450,-150);
        this.shark1.setFree();
        //this.shark1.instance.pivotX = this.shark1.boundInfo.width-50;
        App.actionManager.removeAllActions(this.shark1);

        //this.fishSwimming();
    };

    __proto.initShark = function() {
        this.shark1 = this.newFish({
            id:1017,
            x:1550,
            y:-100,
            rotation:Math.round(Math.random() * (360)) - 1,
            zOrder:4,
            scaleX:1,
            scaleY:1,
            name:"shark1"});

        this.addChild(this.shark1);

    };

    __proto.newFish = function(data) {
        var fish = App.animManager.get(data.id);
        fish.play(0,true,data.id+"");
        fish._zOrder = data.zOrder;
        fish.x = data.x;
        fish.y = data.y;
        fish.rotation = data.rotation;
        fish.name = data.name;
        fish.scale(data.scaleX,data.scaleY);
        fish.init();
        fish.setFree();
        fish.setSpeed(data.speed);
        return fish;
    };

    __proto.initBtnEvent = function() {
        // 加注
        //this.addBetBtn.on(Laya.Event.MOUSE_DOWN, this, this.onBetAdd);
        // 减注
        //this.cutBetBtn.on(Laya.Event.MOUSE_DOWN, this, this.onBetCut);
        this.changeBetBtn.on(Laya.Event.MOUSE_DOWN, this, this.onBet);

        // 清空玩家的下注
        this.clearBtn.on(Laya.Event.MOUSE_DOWN, this, this.onClear);

        // 重复玩家上一局下注
        this.rebetBtn.on(Laya.Event.MOUSE_DOWN, this, this.onReBet);

        // 马上开始
        this.runNowBtn.on(Laya.Event.MOUSE_DOWN, this, this.onRunNow);

        // 退到开始界面
        //this.lobbyBtn.on(Laya.Event.MOUSE_DOWN, this, this.onLobby);

        // 设置界面
        //this.setBtn.on(Laya.Event.MOUSE_DOWN, this, this.onSetting);

        // 添加金币
        //this.goldAddBtn.on(Laya.Event.MOUSE_DOWN, this, this.onGoldAdd);
    };



    __proto.onBet = function() {
        if(this.isRunningNow)
            return;
        Laya.SoundManager.playSound("assets/ui.sounds/sound_ranking.mp3", 1);
        var self = this;

        this.battleController.raise();

        var fadeInOut = Sequence.create([
            ScaleTo.create(0.1,1.4),
            ScaleTo.create(0.3,1)
        ]);
        App.actionManager.addAction(fadeInOut,this.betLight);

        //var complete = function(err,data) {
        //    if(err != null)
        //    {
        //        return;
        //    }
        //    self.onSetDataSource(data.dataSource);
        //};
        //
        //App.netManager.request('/shark/changebet',null, Laya.Handler.create(null, complete));

    };

    //__proto.onBetCut = function() {
    //    if(this.isRunningNow)
    //        return;
    //    Laya.SoundManager.playSound("assets/ui.sounds/sound_ranking.mp3", 1);
    //    var self = this;
    //
    //    var complete = function(err,data) {
    //        if(err != null)
    //        {
    //            return;
    //        }
    //        self.onSetDataSource(data.dataSource);
    //    };
    //
    //    App.netManager.request('/shark/changebet',{type:"unraise"}, Laya.Handler.create(null, complete));
    //};

    __proto.onClear = function() {
        if(this.isRunningNow)
            return;

        var self = this;
        this.runNowBtn.visible = false;
        this.runNowEffect.visible = false;
        self.battleController.clearBet();
        //var complete = function(err,data) {
        //    if(err != null)
        //    {
        //        return;
        //    }
        //
        //    self.onSetDataSource(data.dataSource);
        //    self.clearBet();
        //};
        //
        //App.netManager.request('/shark/clearbet',null, Laya.Handler.create(null, complete));
    };

    __proto.clearBet = function() {
        Laya.SoundManager.playSound("assets/ui.sounds/sound_hit.mp3", 1);

        var child;
        var winLightBg;
        var i;
        for(i = 1 ; i <= 8 ; i++)
        {
            child = this.getChildByName("selectBg"+i);
            winLightBg = this.getChildByName("winLightBg"+i);
            if(child)
            {
                child.zOrder = 102;
                child.visible = false;
            }

            if(winLightBg)
            {
                winLightBg.visible = false;
                App.actionManager.removeAllActions(winLightBg);
            }

            this["circleBg"+i].zOrder = 102;
            this["bet"+i].zOrder = 102;
            this["betBg"+i].zOrder = 102;
            this["fishBetBg"+i].zOrder = 103;
            this["fishBet"+i].zOrder = 104;
            App.actionManager.removeAllActions(this["fishBet"+i]);
            this["fishBet"+i].alpha = 1;
        }

        this.selectFish = {};
        this.clearFishBet();
    };

    __proto.onReBet = function() {
        if(this.isRunningNow)
            return;
        Laya.SoundManager.playSound("assets/ui.sounds/sound_hit.mp3", 1);
        var self = this;

        this.battleController.allBet();
        //var complete = function(err,data) {
        //    if(err != null)
        //    {
        //        return;
        //    }
        //
        //    if(data)
        //    {
        //        self.onSetDataSource(data);
        //
        //        for(var index in self.fishPool)
        //        {
        //            //self.boxBottomIdle.getChildByName("selectBg"+data.selectIndex[index]).visible = true;
        //
        //            self.onSelectCallBack(parseInt(index)+1);
        //        }
        //
        //    }
        //};

        //App.netManager.request('/shark/allbet',null, Laya.Handler.create(null, complete));
    };

    __proto.onRunNow = function() {
        Laya.SoundManager.playSound("assets/ui.sounds/bgm_go.mp3", 1);
        var self = this;


        var drawComplete = function(err,data) {
            if(err != null)
            {
                return;
            }

            var complete = function(err,data) {
                if(err != null)
                {
                    return;
                }
                //self.startRound(data.surviveFish);
                self.battleController.startRound(data);
            };

            var info = self.battleController.getSelectInfo();
            info = JSON.stringify(info);

            App.netManager.request('/shark/runnow', {info: info}, Laya.Handler.create(null, complete));
        };
        App.netManager.request('/shark/draw', null, Laya.Handler.create(null, drawComplete));
    };

    __proto.onLobby = function() {
        if(this.isRunningNow)
            return;
        Laya.SoundManager.playSound("assets/ui.sounds/sound_hit.mp3", 1);
    };

    __proto.onSetting = function() {
        if(this.isRunningNow)
            return;
        Laya.SoundManager.playSound("assets/ui.sounds/sound_hit.mp3", 1);
    };

    __proto.onGoldAdd = function() {
        if(this.isRunningNow)
            return;
        Laya.SoundManager.playSound("assets/ui.sounds/sound_hit.mp3", 1);
    };

    // 初始化界面
    __proto.initView = function() {

    };

    // 界面准备完毕
    __proto.viewReady = function() {
        this.randomBgSkin();
        this.clearBet();

        var self = this;

        var complete = function(err,data) {
            if(err != null)
            {
                return;
            }
            self.battleController.start(data);
            //self.initFish(data.fishPool);
            //self.onSetDataSource(data.retData.dataSource);
            //self.initCircleBgColor(data.retData.colorBgSource);
        };

        App.netManager.request('/shark/ready',null, Laya.Handler.create(null, complete));

    };

    __proto.clearCircleBgChild = function() {
        var circleChild;
        for(var i = 1 ; i <= Papaya.Shark.MaxFish ; i++)
        {
            circleChild = this["circleBg"+i].getChildByName("fishChild");
            if(circleChild)
            {
                circleChild.setGray(false);
                circleChild.dispose();
                this["circleBg"+i].removeChild(circleChild);
            }
        }
    };

    __proto.initCircleBgColor = function(colorBgData) {
        var i;

        // 先清空子节点
        this.clearCircleBgChild();

        for(i = 1 ; i <= 8 ; i++)
        {
            // 倒数时下方界面
            this["circleBg"+i].skin = "assets/ui.common/circleBg" + colorBgData[i] + ".png";
            this["circleBg"+i].on(Laya.Event.MOUSE_DOWN, this, this.onSelect,[i]);
            this["circleBg"+i].filters = null;
        }

        var fishId;
        var fish1;
        var scale;
        for(i = 0 ; i < Papaya.Shark.MaxFish ; i++)
        {
            //console.log("i = " + i);
            fishId = this.fishPool[i].getId();
            //console.log("fishId = " + fishId);
            fish1 = this.newFish({
                id:fishId,
                x:50,
                y:50,
                rotation:0,
                zOrder:1,
                scaleX:1,
                scaleY:1,
                name:"fishChild"});

            scale = this.calFishScale({width:80,height:80} , {width:fish1.boundInfo.width, height:fish1.boundInfo.height});
            fish1.scale(scale.x,scale.y);
            if(fishId == "1011")
                fish1.y -= 10;
            // 把小鱼放到下方界面上（倒数时的下方界面）
            this["circleBg"+(i+1)].addChild(fish1);
        }

        this.initIconAni();
    };

    __proto.calFishScale = function(targetSize,fishSize) {

        var scaleX = targetSize.width/fishSize.width;
        var scaleY = targetSize.height/fishSize.height;

        if(scaleX > 1)
        {
            scaleX = 1;
        }

        if(scaleY > 1)
        {
            scaleY = 1;
        }

        if(scaleX > scaleY)
        {
            return {x:scaleY , y:scaleY};
        }
        else if(scaleX < scaleY)
        {
            return {x:scaleX , y:scaleX};
        }

        return {x:scaleX , y:scaleY};
    };

    // 界面上的图片动画
    __proto.initIconAni = function() {
        var i;
        this.boxResultView.x = -800;

        for(i = 1 ; i <= 8 ; i++)
        {
            this["betBg"+i].scaleY = 0;
            this["bet"+i].scaleY = 0;

            var betBgScale = Sequence.create([
                ScaleTo.create(0.5,1,1),
            ]);
            var betBgScale2 = Sequence.create([
                ScaleTo.create(0.5,1,1),
            ]);
            App.actionManager.addAction(betBgScale, this["betBg"+i]);
            App.actionManager.addAction(betBgScale2, this["bet"+i]);
        }

        var self = this;
        var viewMove = Sequence.create([
            MoveTo.create(0.5,{x:0,y:self.boxResultView.y}),
            CallFunc.create(Laya.Handler.create(this, function(){
                //console.log("self.boxResultView.x = " + self.boxResultView.x);
                //console.log("11111");
            }))
        ]);
        App.actionManager.addAction(viewMove, this.boxResultView);

        //var moveUp = Sequence.create([
        //    MoveTo.create(0.5,{x:self.boxBottomIdle.x,y:833}),
        //    CallFunc.create(Laya.Handler.create(this, function(){
        //        //console.log("self.boxBottomIdle.y = " + self.boxBottomIdle.y);
        //        //console.log("2222");
        //    }))
        //]);
        //App.actionManager.addAction(moveUp, this.boxBottomIdle);
        //console.log("this.boxBottomIdle y = " + this.boxBottomIdle.y);

        //var moveDown = MoveTo.create(0.5,{x:self.boxBottomEat.x,y:990});
        //App.actionManager.addAction(moveDown, this.boxBottomEat);

        self.timer.frameLoop(1,self,self.fishSwimming);
        self.countDownTime = 20;
        self.startCD();

        //var complete = function(err,data) {
        //    if(err != null)
        //    {
        //        return;
        //    }
        //    self.onSetDataSource(data);
        //    self.countDownTime = parseInt(data.countDownLab);
        //    self.timer.frameLoop(1,self,self.fishSwimming);
        //    self.startCD();
        //};
        //
        //App.netManager.request('/shark/restart',null, Laya.Handler.create(null, complete));

    };

    __proto.startCD = function() {

        var self = this;

        var timeLoop= function() {
            self.countDownTime -= 1;
            var cdStr;
            if(self.countDownTime <= 0)
            {
                self.countDownTime = 0;
                cdStr = 0;

                var complete = function(err,data) {
                  if(err != null)
                  {
                      return;
                  }
                    //self.startRound(data.surviveFish);
                    self.battleController.startRound(data);
                };

                App.netManager.request('/shark/runnow',null, Laya.Handler.create(null, complete));
            }
            else if(self.countDownTime < 10 && self.countDownTime > 0)
            {
                cdStr = "0"+self.countDownTime;
                self.timeOut = setTimeout(timeLoop,1000);
            }
            else
            {
                cdStr = self.countDownTime;
                self.timeOut = setTimeout(timeLoop,1000);
            }
            self.setBoxCountDownDataSource({"countDownLab":cdStr});
        };

        this.timeOut = setTimeout(timeLoop,1000);
    };

    __proto.startRound = function(surviveId) {
        Laya.SoundManager.playMusic("assets/ui.sounds/music_go.mp3", 10000);
        this.surviveFish = surviveId;
        this.winReward.visible = true;
        this.winImage.visible = true;
        this.timesUp();
    };

    // 倒计时结束
    __proto.timesUp = function() {
        clearTimeout(this.timeOut);
        this.isRunningNow = true;
        this.boxCountDown.visible = false;
        this.maskBg.visible = true;

        var viewMoveOut = MoveTo.create(0.5,-800,this.boxResultView.y);
        App.actionManager.addAction(viewMoveOut, this.boxResultView);

        var moveOut =  MoveTo.create(0.5,{x:-300 , y:this.rebetBtn.y});
        App.actionManager.addAction(moveOut, this.rebetBtn);

        var moveIn =  MoveTo.create(0.5,{x:-144 , y:this.rebetBtn.y});
        App.actionManager.addAction(moveIn, this.clearBtn);

        //this.fishPool.splice(this.fishPool.indexOf(this.shark1),1);
        //this.fishPool.splice(this.fishPool.indexOf(this.shark2),1);



        this.startEat(this.shark1);
    };

    __proto.fishSwimming = function() {
        for(var index in this.fishPool)
        {
            this.fishPool[index].swim();
        }
    };

    // 开始吃鱼
    __proto.startEat = function(shark) {

        var beEatenFishPool = [];
        var fish;

        for(var index in this.fishPool)
        {
            fish = this.fishPool[index];
            if(fish.getUnderEat() || fish.id == this.surviveFish)
                continue;

            var obj = {};
            obj.fish = fish;
            obj.distance = Point.pDistance({x:fish.x,y:fish.y},{x:shark.x,y:shark.y});
            beEatenFishPool.push(obj);
        }

        var sortt = function(a,b) {
            return a.distance < b.distance;
        }

        beEatenFishPool.sort(sortt);

        //var randomIndex = Math.round(Math.random() * (beEatenFishPool.length-1));

        var food = beEatenFishPool[0].fish;
        shark.on(Fish.Event.Eated,this,this.onEat);
        shark.on(Fish.Event.NextEat,this,this.startEat);
        this.setFishStarDistance();
        shark.eat(food);
    };


    __proto.onEat = function(sharkName,food) {
        var self = this;
        var shark = this.getChildByName(sharkName);

        var foodIndex = this.fishPool.indexOf(food);
        this.fishPool.splice(foodIndex,1);

        this.removeChild(food);
        food.dispose();

        for(var i = 1 ; i <= Papaya.Shark.MaxFish ; i++)
        {
            var child = this["circleBg"+i].getChildByName("fishChild");
            if(child.id == food.id)
            {
                child.setGray(true);
                var grayscaleMat = [0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0];
                var grayscaleFilter = new Laya.ColorFilter(grayscaleMat);
                this["circleBg"+i].filters = [grayscaleFilter];
                this["circleBg"+i].zOrder = 100;
                this["bet"+i].zOrder = 100;
                this["betBg"+i].zOrder = 100;
                this["fishBetBg"+i].zOrder = 100;
                this["fishBet"+i].zOrder = 100;
                if(this.getChildByName("selectBg"+i))
                    this.getChildByName("selectBg"+i).zOrder = 100;
                break;
            }
        }

        if(this.fishPool.length == 1)
        {
            this.shark1.cleatFrameEat();
            this.shark1.speed = 2;
            this.fishPool.push(this.shark1);
            setTimeout(function(){
                self.battleController.gameOver();
            },1000);
        }
        else
        {
            //self.startEat(shark);
        }

    };

    __proto.gameOver = function(data) {

        this.shark1.off(Fish.Event.Eated,this,this.onEat);
        this.shark1.off(Fish.Event.NextEat,this,this.startEat);
        var self = this;

        if(data.clearRecordHistory)
        {
            self.onClearRecordHistory();
        }

        var winReward = data.winReward;
        var winRate = 0;
        if(parseInt(winReward) > 0)
        {
            var index = self.selectIndex.indexOf(this.surviveFish);
            this.selectWinSounds(index);
            winRate = data.surviveRate;
        }
        else if(parseInt(winReward) == 0)
        {
            Laya.SoundManager.playSound("assets/ui.sounds/music_fail.mp3", 1);
        }
        this.onSetRecordHistory(data.currentGameTime,data.recordHistory);
        this.winTip(self.surviveFish);
        App.runMassageView(self.surviveFish,winRate,winReward);
    };

    __proto.selectWinSounds = function(selectIndex) {
        //console.log("selectIndex = " + selectIndex);
        var bet = this["bet"+selectIndex].text;
        bet = parseInt(bet.split("A")[1]);
        if(bet >= 10)
        {
            Laya.SoundManager.playSound("assets/ui.sounds/music_win10X.mp3", 1);
        }
        else
        {
            Laya.SoundManager.playSound("assets/ui.sounds/music_win.mp3", 1);
        }
    };

    // 下方金币闪动
    __proto.winTip = function(surviveFish) {
        var fish;
        for(var i = 1 ; i < 8 ; i++)
        {
            fish = this["circleBg"+i].getChildByName("fishChild");
            if(fish.id == surviveFish)
            {
                //this["circleBg"+i].zOrder = 105;
                //this["bet"+i].zOrder = 105;
                //this["betBg"+i].zOrder = 105;
                //this["fishBetBg"+i].zOrder = 105;
                //this["fishBet"+i].zOrder = 105;

                var fade = Sequence.create([
                    FadeIn.create(0.5),
                    FadeOut.create(0.5)
                ]);

                App.actionManager.addAction(fade.repeatForever(), this["fishBet"+i]);

                var winLightBg;
                if(this.getChildByName("winLightBg"+i))
                {
                    winLightBg = this.getChildByName("winLightBg"+i);
                    winLightBg.visible = true;
                }
                else
                {
                    winLightBg = new Laya.Sprite();
                    winLightBg.loadImage("assets/ui.common/quan.png");
                    winLightBg.pivotX = 75;
                    winLightBg.pivotY = 75;
                    winLightBg.x = this["circleBg"+i].x;
                    winLightBg.y = this["circleBg"+i].y;
                    winLightBg.name = "winLightBg"+i;
                    winLightBg.zOrder = 104;
                    this.addChild(winLightBg);
                }


                var fadeInOut =Sequence.create([
                    FadeIn.create(0.08),
                    FadeOut.create(0.08),
                    FadeIn.create(0.08),
                    FadeOut.create(0.08),
                    FadeIn.create(0.08),
                    FadeOut.create(0.08),
                    DelayTime.create(0.8)
                ]);
                App.actionManager.addAction(fadeInOut.repeatForever(), winLightBg);
                break;
            }
        }

    };

    // 金币滚动动画
    __proto.goldRollAni = function(winReward) {
        var currentGold = parseInt(this.goldLab.text);
        var winGold = parseInt(this.winReward.text);

        var self = this;
        if(winReward <= 0)
        {
            setTimeout(function(){
                App.removeMassageView();
                self.nextRound();
            },2000);
            return;
        }

        //var rollWin = 0;
        //this.winReward.text = 0;

        var scale1 = ScaleTo.create(1,1.3);

        var scale2 = Sequence.create([
            ScaleTo.create(1,1.3),
            DelayTime.create(0.8),
            CallFunc.create(Laya.Handler.create(self,function(){
                Laya.SoundManager.playSound("assets/ui.sounds/sound_getcoins.mp3", 1);

                var winRewardGoldRoll = Sequence.create([
                    NumberTo.create(2,0,winReward)
                ]);

                var accountGoldRoll = Sequence.create([
                    NumberTo.create(2,currentGold,(currentGold+winReward)),
                    CallFunc.create(Laya.Handler.create(null,function(){
                        setTimeout(function(){
                            App.removeMassageView();
                            self.nextRound();
                        },1000);
                    }))
                ]);

                App.actionManager.addAction(winRewardGoldRoll,self.winReward);
                App.actionManager.addAction(accountGoldRoll,self.goldLab);

                //var rollTime = 120;
                //
                //var frameIncrement = Math.round(winReward/rollTime);
                //if(frameIncrement <= 0)
                //{
                //    frameIncrement = 1;
                //}
                //var diffGold;
                //var rollFun = function(){
                //    winReward -= frameIncrement;
                //    if(winReward <= 0)
                //    {
                //        diffGold = frameIncrement - Math.abs(winReward);
                //        winReward = 0;
                //        currentGold += diffGold;
                //        winGold += diffGold;
                //    }
                //    else
                //    {
                //        currentGold += frameIncrement;
                //        winGold += frameIncrement;
                //    }
                //
                //    self.winReward.text = winGold;
                //    self.goldLab.text = currentGold;
                //
                //    if(winReward <= 0)
                //    {
                //        self.clearTimer(self,rollFun);
                //        setTimeout(function(){
                //            App.removeMassageView();
                //            self.nextRound();
                //        },1000);
                //    }
                //};
                //
                //self.timer.frameLoop(1,self,rollFun);
            }))
        ]);

        App.actionManager.addAction(scale1, this.winImage);
        App.actionManager.addAction(scale2, this.winReward);
    };

    __proto.nextRound = function() {
        this.maskBg.visible = false;
        this.winReward.visible = false;
        this.winImage.visible = false;
        this.winReward.scale(1,1);
        this.winImage.scale(1,1);
        this.isRunningNow = false;
        this.removeChild(this.fishPool[0]);
        this.fishPool.splice(0,this.fishPool.length);
        this.fishPool = [];

        this.boxCountDown.visible = true;
        this.onClear();

        App.animManager.resetAllFish();
        this.selectIndex = [];

        var moveOut =  MoveTo.create(0.5,{x:20 , y:this.rebetBtn.y});
        App.actionManager.addAction(moveOut, this.rebetBtn);

        var moveIn =  MoveTo.create(0.5,{x:176 , y:this.rebetBtn.y});
        App.actionManager.addAction(moveIn, this.clearBtn);
        //App.netManager.request('/shark/readyt',null, Laya.Handler.create(null, complete));
        this.viewReady();
    };

    __proto.onSelect = function(index) {
        if(this.isRunningNow)
            return;
        Laya.SoundManager.playSound("assets/ui.sounds/sound_hit.mp3", 1);
        var self = this;

        this.battleController.select(index-1);

        //var complete = function(err,data) {
        //    if(err != null)
        //    {
        //        return;
        //    }
        //
        //    self.onSetDataSource(data.dataSource);
        //
        //    self.onSelectCallBack(index);
        //
        //};
        //
        //App.netManager.request('/shark/select',{selectIndex:(index-1)}, Laya.Handler.create(null, complete));



    };

    __proto.onSelectCallBack = function(index) {
        var fish = this["circleBg"+index].getChildByName("fishChild");

        var fishId = fish.id;
        if(!this.selectFish[fishId])
        {
            this.selectFish[fishId] = true;

            if(this.getChildByName("selectBg"+index))
            {
                this.getChildByName("selectBg"+index).visible = true;
            }
            else
            {
                var selectBg = new Laya.Sprite();
                selectBg.loadImage("assets/ui.common/selectBg.png");
                selectBg.pivotX = 69;
                selectBg.pivotY = 64;
                selectBg.x = this["circleBg"+index].x;
                selectBg.y = this["circleBg"+index].y;
                selectBg.name = "selectBg"+index;
                selectBg.zOrder = 101;
                this.addChild(selectBg);
            }

        }

        if(!this.selectIndex[index])
        {
            this.selectIndex[index] = fishId;
        }

        if(this.selectIndex.length == 0)
        {
            this.runNowBtn.visible = false;
            this.runNowEffect.visible = false;
        }
        else
        {
            this.runNowBtn.visible = true;
            this.runNowEffect.visible = true;
        }
    };

    __proto.randomBgSkin = function() {
        var randomIndex = 1+Math.round(Math.random()*3);
        this.bg_backGround.skin = "assets/ui.bg/bg" + randomIndex + ".jpg";
        Laya.SoundManager.playMusic("assets/ui.sounds/music_map"+randomIndex+".mp3", 100000);
    };

    __proto.setFishStarDistance = function() {
        var fish;
        for(var i = 0 ; i < this.fishPool.length ; i++)
        {
            fish = this.fishPool[i];
            var startDistance = Point.pDistance({x:fish.x,y:fish.y} , {x:this.shark1.x,y:this.shark1.y});
            fish.setStartDistance(startDistance);
        }
    };

    __proto.clearFishBet = function() {
        var data = {};
        for(var i = 1 ; i <= 8 ; i++)
        {
            data["fishBet"+i] = 0;
        }

        this.onSetDataSource(data);
    };

    __proto.setBetLightEffect = function(betScore) {
        this.betLight.skin = "assets/ui.common/light"+betScore+".png";
    };

    return BattleView;
})(BattleViewUI);