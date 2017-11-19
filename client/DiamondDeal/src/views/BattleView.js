var BattleView = (function(_super) {
    function BattleView() {
        BattleView.super(this);
        this.init();
    }

    Laya.class(BattleView, "BattleView", _super);

    var __proto = BattleView.prototype;

    __proto.init = function() {
        this.nextWinReward.font = "purple_white";
        this.totalReward.font = "yellow";
        this.diamondLeft.font = "yellow";
        this.winReward.font = "white_red";
        this.account.font = "white";
        this.endReward.font = "big_gray_purple";

        this.quickPickBox.y = 910;

        this.mFactory = new Laya.Templet();
        this.mFactory.loadAni("assets/effect/openBlockEffect/poacher.sk");

        this.initView();
        this.initWinAni();
        this.initBtnEvent();
    };

    __proto.initView = function() {
        this.img_unlucky.visible = false;
        this.winBox.visible = false;
        this.autoPicking = false;
        this.cashOutBox.visible = false;
        this.winReward.visible = false;
        this.winBox.visible = false;
        this.alreadyHadDiamond = [];
    };

    __proto.initBtnEvent = function() {
        this.quickPickBtn.on(Laya.Event.MOUSE_DOWN, this, this.onQuickPick);

        this.cashOutBtn.on(Laya.Event.MOUSE_DOWN, this, this.onCashOut);
    };

    __proto.initWinAni = function() {
        var ani1 = App.animManager.get("ani.win.backGround1");
        ani1.x = 230;
        ani1.y = 216;
        ani1.zOrder = -1;
        this.winBox.addChild(ani1);
        ani1.play();

        var ani4 = App.animManager.get("ani.win.backGround4");
        ani4.x = 230;
        ani4.y = 216;
        ani4.zOrder = -1;
        this.winBox.addChild(ani4);
        ani4.play();


        var ani2 = App.animManager.get("ani.win.backGround2");
        ani2.pivotX = 360;
        ani2.pivotY = 104;
        ani2.x = this.topLightBg.x;
        ani2.y = this.topLightBg.y;
        this.winBox.addChild(ani2);
        ani2.play();

        var ani3 = App.animManager.get("ani.win.backGround3");
        ani3.pivotX = 692;
        ani3.pivotY = 94;
        ani3.x = 720;
        ani3.y = 800;
        ani4.zOrder = -1;
        this.winBox.addChild(ani3);
        ani3.play();
    };

    // 重玩上次下线时的局
    __proto.inheritLastTime = function(data) {
        var self = this;
        this.initView();
        var dataSource = {};

        dataSource.nextWinReward = data.viewNextReward;
        dataSource.totalReward = data.viewTotalReward;
        dataSource.diamondLeft = data.diamondLeft;
        dataSource.winReward = data.viewCurrentReward;

        if(data.viewCurrentReward != 0)
        {
            self.cashOutBox.visible = true;
            self.winReward.visible = true;
        }

        self.setLifeLight(data.life);
        self.setDataSource(null,dataSource);
        self.viewAni();

        this.blocks = data.blocks;

        for(var blocksKey in data.blockOpened)
        {
            if(data.blockOpened[blocksKey].state == Papaya.Block_State.Open)
            {
                this.setResult(data.blockOpened[blocksKey].type,data.blockOpened[blocksKey].pos);
            }
        }

    };

    // 自动选择
    __proto.onQuickPick = function() {
        var self = this;

        if(this.life <= 0 || this.autoPicking)
        {
            return;
        }

        var complete = function(err,data) {
            if(err != null)
            {
                console.log("err err err err");
                console.log(err);
                return;
            }

            self.touchView.off(Laya.Event.MOUSE_DOWN, self, self.onSelect);
            self.startAutoPick(data,0);
            self.autoPicking = true;

        };
        App.netManager.request('/diamondDeal/quickPick',null, Laya.Handler.create(null, complete));
    };

    // 开始自动选择的表现
    __proto.startAutoPick = function(data,startIndex) {
        var self = this;
        var count = startIndex;
        setTimeout(function(){
            var gridInfo = data[count];
            if(gridInfo)
            {
                self.setResult(gridInfo.selectType,gridInfo.pos,function(){
                    //console.log("count = " + count);
                    self.setDataSource(null,gridInfo.dataSource);
                    self.setLifeLight(gridInfo.life);

                    if(gridInfo.gameEndType == Papaya.Game_End_Type.Life)
                    {
                        setTimeout(function(){
                            self.unLuckyEnd();
                        },1000);
                        self.autoPicking = false;
                    }
                    else if(gridInfo.gameEndType == Papaya.Game_End_Type.Diamond)
                    {
                        setTimeout(function(){
                            self.winEnd();
                        },1000);
                        self.setDataSource(self.winBox,{endReward:gridInfo.endReward});
                        self.autoPicking = false;
                    }
                    else
                    {
                        count++;
                        self.startAutoPick(data,count);
                    }
                });

            }
            else
            {
                self.touchView.on(Laya.Event.MOUSE_DOWN, self, self.onSelect);
                self.autoPicking = false;
            }

        },800)
    };

    // 提取金币
    __proto.onCashOut = function() {
        var self = this;
        if(this.life <= 0)
        {
            return;
        }

        var complete = function(err,data) {
            if(err != null)
            {
                return;
            }
            console.log("data = " + JSON.stringify(data));
            self.setDataSource(self.winBox,data.dataSource);
            self.winEnd();
        };
        App.netManager.request('/diamondDeal/cashOut',null, Laya.Handler.create(null, complete));
    };

    // 游戏开始
    __proto.gameStart = function(data) {
        //var self = this;
        //var complete = function(err,data) {
        //    if(err != null)
        //    {
        //        return;
        //    }
        //
        //    if(data)
        //    {
        //
        //
        //    }
        //};
        //App.netManager.request('/diamondDeal/gameStart',{bet:bet}, Laya.Handler.create(null, complete));

        this.blocks = data.blocks;
        this.initView();
        this.viewAni();
        this.setLifeLight(data.life);
        this.setDataSource(null,data.dataSource);
    };

    // 界面动画
    __proto.viewAni = function() {

        var self = this;
        var moveUp = Sequence.create([
            MoveTo.create(0.5,{x:this.quickPickBox.x,y:762}),
            CallFunc.create(Laya.Handler.create(null,function(){
                self.touchView.on(Laya.Event.MOUSE_DOWN, self, self.onSelect);
            }))
        ]);

        App.actionManager.addAction(moveUp,this.quickPickBox);

        if(this.cashOutBox.visible)
        {
            this.cashOutBox.y = 910;
            var moveUp2 = Sequence.create([
                MoveTo.create(0.5,{x:this.cashOutBox.x,y:732})
            ]);
            App.actionManager.addAction(moveUp2,this.cashOutBox);

            this.winReward.y = 1019;
            var moveUp3 = Sequence.create([
                MoveTo.create(0.5,{x:this.winReward.x,y:841})
            ]);
            App.actionManager.addAction(moveUp3,this.winReward);
        }
    };

    // 选择格子
    __proto.onSelect = function() {
        var touchPos = this.touchView.getMousePoint();
        var self = this;
        var complete = function(err,data){
            if(err != null)
            {
                return;
            }

            if(!data)
            {
                return;
            }


            self.setResult(data.selectType,data.pos,function(){
                if(data.gameEndType == Papaya.Game_End_Type.Life)
                {
                    setTimeout(function(){
                        self.unLuckyEnd();
                    },1000);
                    self.touchView.off(Laya.Event.MOUSE_DOWN, self, self.onSelect);
                }
                else if(data.gameEndType == Papaya.Game_End_Type.Diamond)
                {
                    setTimeout(function(){
                        self.winEnd();
                    },1000);
                    self.touchView.off(Laya.Event.MOUSE_DOWN, self, self.onSelect);
                    self.setDataSource(self.winBox,{endReward:data.endReward});
                }

                self.setDataSource(null,data.dataSource);
                self.setLifeLight(data.life);
            });
        };

        App.netManager.request('/diamondDeal/select',{pos:touchPos}, Laya.Handler.create(null, complete));
    };

    // 设置生命灯
    __proto.setLifeLight = function(life)
    {
        var i;
        this.life = life;
        if(life == 4)
        {
            for(i = 4 ; i > 0 ; i--)
            {
                this["life"+i].visible = true;
            }
        }
        else
        {
            for(i = 4 ; i > 0 ; i--)
            {
                if(i > life)
                {
                    this["life"+i].visible = false;
                }
            }
        }
    };

    // 设置格子打开状态
    __proto.setResult = function(type,pos,cb) {

        if(type == Papaya.Block_Type.Diamond)
        {
            this.createImage(pos,"idle",cb);
            this.cashOutBox.visible = true;
            this.winReward.visible = true;
            this.alreadyHadDiamond.push(pos);
        }
        else if(type == Papaya.Block_Type.Nothing)
        {
            this.createImage(pos,"idle2",cb);
        }

        this.blocks[pos.r][pos.c].state = Papaya.Block_State.Open;
        this.blocks[pos.r][pos.c].type = type;

    };

    // 创建钻石还是空格子图片
    __proto.createImage = function(pos,aniType,cb)
    {
        var effectSkeleton = this.mFactory.buildArmature(0);

        effectSkeleton.url = "assets/effect/openBlockEffect/poacher.sk";
        effectSkeleton.pos(pos.c*99+42, pos.r*99+45);
        effectSkeleton.scale(1.05,1.05);
        this.touchView.addChild(effectSkeleton);
        effectSkeleton.play(aniType,false);

        //var played = function()
        //{
        //    //console.log("cb cb")
        //
        //};
        //effectSkeleton.on(Laya.Event.STOPPED,this,played);
        if(cb)
        {
            var self = this;
            var frameFn = function() {
                var currentFrameIndex = effectSkeleton.player.currentKeyframeIndex;
                if(currentFrameIndex > 40)
                {
                    cb();
                    self.timer.clear(self,frameFn);
                }
            };

            this.timer.frameLoop(1,this,frameFn);
        }


        //var img = new Laya.Image();
        //img.skin = bgUrl;
        //img.x = pos.c*99;
        //img.y = pos.r*99;
        //this.touchView.addChild(img);

        //if(diamondUrl)
        //{
        //    var dia = new Laya.Image();
        //    dia.skin = diamondUrl;
        //    dia.pivot(37.5,30.5);
        //    dia.x = 44;
        //    dia.y = 44;
        //    img.addChild(dia);
        //}

    };

    // 失败处理
    __proto.unLuckyEnd = function() {

        var tempBlocks = [];
        var i;
        var pos;
        for(i = 0 ; i < 50 ; i++)
        {
            tempBlocks.push(i);
        }

        var leftDiamondCount = 10 - this.alreadyHadDiamond.length;

        for(i in this.alreadyHadDiamond)
        {
            var gridIndex = Number(this.posToString(this.alreadyHadDiamond[i]));
            tempBlocks.splice(gridIndex,1);
        }

        for(i = 0 ; i < leftDiamondCount ; i++)
        {
            var randomIndex = Papaya.Utils.random_number(tempBlocks.length);
            var randomBlock = tempBlocks[randomIndex];
            tempBlocks.splice(randomIndex,1);
            var strBlock = String(randomBlock);
            this.alreadyHadDiamond.push(this.stringToPos(strBlock));
        }

        for(i in this.alreadyHadDiamond)
        {
            pos = this.alreadyHadDiamond[i];
            this.blocks[pos.r][pos.c].type = Papaya.Game_End_Type.Diamond;
        }

        for(i = 0 ; i < 50 ; i++)
        {
            pos = this.stringToPos(i);
            if(this.blocks[pos.r][pos.c].state != Papaya.Block_State.Open)
            {
                if(this.blocks[pos.r][pos.c].type == Papaya.Game_End_Type.Diamond)
                {
                    this.createImage(pos,"idle");
                }
                else
                {
                    this.createImage(pos,"idle2");
                }
            }
        }

        this.img_unlucky.visible = true;

        setTimeout(function(){
            App.runBetView();
        },1500);
    };

    // 胜利处理
    __proto.winEnd = function() {
        var self = this;
        this.winBox.visible = true;
        this.topLightBg.visible = true;
        console.log("this.endReward.text = " + this.endReward.text);
        var goldRoll = Sequence.create([
            NumberTo.create(2,0,Number(this.endReward.text)),
            CallFunc.create(Laya.Handler.create(null,function(){
                setTimeout(function(){
                    App.runBetView();
                },1500);
            }))
        ]);
        App.actionManager.addAction(goldRoll,this.endReward);

    };

    // 更新数据
    __proto.setDataSource = function(box,obj) {
        if(box)
        {
            box.dataSource = obj;
        }
        else
        {
            this.dataSource = obj;
        }
        //console.log("balance = " + App.player.balance);
        this.account.text = App.player.balance;
    };

    // 字符串转坐标
    __proto.stringToPos = function(str)
    {
        str = String(str);
        var row;
        var column;
        if(str.length == 1)
        {
            row = 0;
            column = Number(str);
        }
        else if(str.length == 2)
        {
            row = Number(str[0]);
            column = Number(str[1]);
        }

        return {r:row,c:column};
    };

    // 坐标转字符串
    __proto.posToString = function(pos){
        return (String(pos.r) + String(pos.c));
    };

    __proto.dispose = function() {
        this.touchView.removeChildren();
    };

    return BattleView;
}(BattleViewUI));