var Poker = (function(_super) {
    function Poker() {
        Poker.super(this);

        this.instance = null;
        this.front = null;
        this.back = null;
        this.frame = null;
        this.cover = null;
        this.offsetX = 6;
        this.offsetY = 12;
        this.holded = false;
        this.state = Poker.STATE_BACK;

        this.init();
    }

    Laya.class(Poker, "Poker", _super);

    Poker.prototype.init = function() {
        this.front = new Laya.Image();
        this.front.zOrder = 2;

        this.back = new Laya.Image();
        this.back.skin = "assets/pokers/poker_back.png";
        this.back.zOrder = 2;

        this.back.on(Laya.Event.MOUSE_DOWN, this, this.onClick);

        this.frame = new Laya.Image();
        this.frame.skin = "assets/pokers/poker_frame.png";
        this.frame.zOrder = 1;
        this.frame.x -= 3;
        this.frame.y -= 2;

        this.cover = new Laya.Image();
        this.cover.skin = "assets/pokers/poker_hold.png";
        this.cover.zOrder = 3;
        this.cover.x = 6;
        this.cover.y = 180;

        this.aniBlink = App.animManager.get("ani.poker.blink");
        this.aniBlink.interval = 240;
        this.aniBlink.x -= 10;
        this.aniBlink.y -= 10;

        this.front.on(Laya.Event.MOUSE_DOWN, this, this.onClick);

        // 当前显示的牌面（正面反面）
        this.currentPoker = this.back;

        this.pivot(this.frame.width/2, this.frame.height/2);
        this.addChild(this.back);
        this.frameLoop(1, this, this.update);
    };

    Poker.prototype.openTouch = function(flag) {
        if(flag)
            this.back.on(Laya.Event.MOUSE_DOWN, this, this.onSelect);
        else
            this.back.off(Laya.Event.MOUSE_DOWN, this, this.onSelect);
    };
    Poker.prototype.onClick = function(e) {
        if (e.target === this.back) {
            this.event(Poker.Event.SELECT)
        } else {
            this.event(Poker.Event.HOLD);
        }
    };

    Poker.prototype.onSelect = function() {
        EventMgr.emit(Lucky5.Game_Event.Event.SELECTPOKER,this.id);
    };

    Poker.prototype.setValue = function(instance) {
        this.instance = instance;
        this.front.skin = "assets/pokers/" + instance.type + "_" + instance.name + ".png";
    };

    Poker.prototype.flip = function(toState) {
        if (this.state == toState) {
            return;
        }

        App.assetsManager.playSound("flip");
        var seq = Sequence.create([
            ScaleTo.create(0.15, 0, 1),
            CallFunc.create(Laya.Handler.create(this, this.toggle)),
            ScaleTo.create(0.15, 1, 1)
        ]);

        this.runAction(seq);
    };

    Poker.prototype.hold = function() {
        if (this.holded == false) {
            App.assetsManager.playSound("hold");
            this.holded = true;
            this.addChild(this.frame);
            this.addChild(this.cover);
        }
        else {
            App.assetsManager.playSound("unhold");
            this.holded = false;
            this.removeChild(this.frame);
            this.removeChild(this.cover);
        }
    };

    Poker.prototype.select = function() {
        if (this.selected == false) {
            this.addChild(this.frame);
            this.selected = true;
            App.assetsManager.playSound("unhold");
        }
        else {
            this.removeChild(this.frame);
            this.selected = false;
            App.assetsManager.playSound("unhold");
        }
    };

    Poker.prototype.toggle = function() {

        if (this.state == Poker.STATE_BACK) {
            this.removeChild(this.back);
            this.addChild(this.front);
            this.currentPoker = this.front;
            this.state = Poker.STATE_FRONT;
        }
        else {
            if (this.holded == true) {
                this.removeChild(this.frame);
                this.removeChild(this.cover);
                this.holded = false;
            }

            if (this.selected == true) {
                this.removeChild(this.frame);
                this.selected = false;
            }

            this.aniBlink.stop();
            this.setGray(false);

            this.removeChild(this.aniBlink);
            this.removeChild(this.front);
            this.addChild(this.back);

            this.currentPoker = this.back;
            this.instance = null;
            this.state = Poker.STATE_BACK;
        }
    };

    Poker.prototype.runAction = function(action) {
        App.actionManager.addAction(action, this, false);
    };

    Poker.prototype.blink = function() {
        this.addChild(this.aniBlink);
        this.aniBlink.play();
    };
    
    Poker.prototype.stop = function() {
        this.removeChild(this.aniBlink);
        this.aniBlink.stop();
    };

    Poker.prototype.update = function() {
    };

    Poker.prototype.setGray = function(gray) {
        this.front.gray = gray;
        this.back.gray = gray;
    };

    Poker.prototype.grayPoker = function(isGray) {
        //var grayscaleMat = [0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0];
        //var grayscaleFilter = new Laya.ColorFilter(grayscaleMat);
        this.currentPoker.gray = isGray;
    };

    Poker.prototype.grayReset = function() {
        this.front.gray = false;
        this.back.gray = false;
    };

    Poker.Event = {};
    Poker.Event.HOLD = "hold";
    Poker.Event.SELECT = "select";

    Poker.STATE_FRONT = 0;
    Poker.STATE_BACK = 1;

    return Poker;
}(Laya.Sprite));