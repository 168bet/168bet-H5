var MassageView = (function(_super) {
    function MassageView() {
        MassageView.super(this);
    }

    Laya.class(MassageView, "MassageView", _super);

    var __proto = MassageView.prototype;

    __proto.show = function(surviveId,winReward) {
        this.surviveId = surviveId;
        this.winReward = winReward || 0;
        if(!this.ani)
        {
            this.ani = new Laya.Animation();
            this.ani.interval = 100;
            this.ani.index = 0;
            this.ani.x = 720;
            this.ani.y = 450;
            this.addChild(this.ani);
        }

        if(!this.effectAni)
        {
            this.effectAni = new Laya.Animation();
            this.effectAni.interval = 100;
            this.effectAni.index = 0;
            this.effectAni.pivotX = 110;
            this.effectAni.pivotY = 110;
            this.effectAni.x = 720;
            this.effectAni.y = 450;
            this.effectAni.zOrder = -1;
            this.effectAni.scale(1.4,1.4);
            this.addChild(this.effectAni);
        }
        this.init();
    };

    __proto.init = function() {
        this.ani.loadAtlas("ani/" + this.surviveId + "/" + this.surviveId + ".json",null,this.surviveId);
        var boundBox = this.ani.frames[0].getBounds();
        this.ani.pivotX = boundBox.width/2;
        this.ani.pivotY = boundBox.height/2;
        this.ani.play(0,true,this.surviveId);
        var size = this.calFishScale({width:250,height:250},{width:boundBox.width,height:boundBox.height});
        this.ani.scale(size.x,size.y);

        this.rewardLabel1.text = "A"+this.winReward;
        this.rewardLabel2.text = "A"+this.winReward;

        this.fishName1.skin = "assets/ui.common/title_" + this.surviveId + ".png";
        this.fishName2.skin = "assets/ui.common/title_" + this.surviveId + ".png";

        var self = this;
        // 动画
        this.viewBox.scale(3,3);
        this.ani.scale(3,3);

        var clockwiseRotate = Sequence.create([
                RotateTo.create(8,720)
            ]);

        var bigToNormalScale2 = Sequence.create([
            ScaleTo.create(2,size.x,size.y),
            CallFunc.create(Laya.Handler.create(this, function(){
                App.actionManager.addAction(clockwiseRotate.repeatForever(), self.ani);
            })),
        ]);

        App.actionManager.addAction(bigToNormalScale2, this.ani);

        var antClockWiseRotate = Sequence.create([
                RotateTo.create(8,-720)
            ]);

        var bigToNormalScale = Sequence.create([
                ScaleTo.create(2,1),
                CallFunc.create(Laya.Handler.create(this, function(){
                    //Shark.eventManager.emit(Shark.Event.GOLD_ROLL);
                    self.event(MassageView.battleViewGoldRoll);
                    App.actionManager.addAction(antClockWiseRotate.repeatForever(), self.viewBox);
                    setTimeout(function(){
                        self.effectAni.play(0,true,"starEffect");
                    },500);
                })),
            ]);

        App.actionManager.addAction(bigToNormalScale, this.viewBox);

        //setTimeout(function(){
        //    Laya.stage.removeChild(self);
        //    Fishing.eventManager.emit(Fishing.GameEvent.NEXT_ROUND);
        //},6000);
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

    __proto.dispose = function() {
        if(this.ani)
        {
            this.ani.clear();
        }

        if(this.effectAni)
        {
            this.effectAni.clear();
        }
    }

    MassageView.battleViewGoldRoll = "goldRoll";

    return MassageView;
})(massageViewUI);