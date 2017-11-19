
var UIManager = (function(_super) {
    function UIManager() {
        UIManager.super(this);

    }

    Laya.class(UIManager, "UIManager", _super);

    UIManager.prototype.init = function(callback) {
        callback && callback();
    };

    UIManager.prototype.showMessage = function(msg,callback) {
        if(this.boxMessage){
            return null;
        }

        var boxMessage = null;
        if(msg.err){
            msg = this.getErrString(msg);
        }

        boxMessage = new BoxMessage(msg);

        var self = this;

        this.boxMessage  = boxMessage;

        var onBackOut = function() {
            self.boxMessage = null;
            Laya.stage.removeChild(boxMessage);
            boxMessage.destroy();
            if(callback){
                callback();
            }
        };
        var onBackIn = function() {
            Laya.Tween.to(
                boxMessage, 
                {x: Laya.stage.width + boxMessage.width}, 
                300, 
                Laya.Ease["backOut"],
                Laya.Handler.create(null, onBackOut),
                1000,
                false
            );
        };
        
        Laya.Tween.from(
            boxMessage, 
            {x: 0}, 
            500, 
            Laya.Ease["backIn"], 
            Laya.Handler.create(null, onBackIn)
        );
        Laya.stage.addChild(boxMessage);
    };

    UIManager.prototype.showMessageDialog = function (msg,cd){

        var layer = new Laya.View();
        layer.mouseEnabled = true;
        layer.mouseThrough = true;

        var messageDialog = new MessageDialog(msg);
        var close = messageDialog.close;
        messageDialog.close = function (){
            if(close){
                close();
            }
            if(cd){
                cd()
            }

            layer.removeSelf();
        };

        messageDialog.anchorX = 0.5;
        messageDialog.anchorY = 0.5;
        messageDialog.x = Laya.stage.width/2;
        messageDialog.y = Laya.stage.height/2;

        layer.addChild(messageDialog);
        Laya.stage.addChild(layer);
        this.addShieldLayerDialog(layer);
        this.doScaleAction(messageDialog,1,messageDialog.openView);
    };

    UIManager.prototype.showDoubleView = function (){
        var tableView = App.getRunView() ;

        if (tableView.sendDoubleEnter){
            tableView.sendDoubleEnter();
        }
    };

    UIManager.prototype.showTableView = function (){
        var tableView = App.getRunView() ;

        if (tableView.openTableView){
            tableView.openTableView();
        }
    };

    UIManager.prototype.addShieldLayerDialog = function(layer,alpha,isDispose){
        isDispose = isDispose || false;
        alpha = alpha || 0.3;
        //屏蔽层
        var shieldLayer = new Laya.Sprite();
        shieldLayer.alpha = alpha;
        shieldLayer.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
        layer.addChild(shieldLayer);
        var layerPos = layer.localToGlobal(Point.p(0,0));
        shieldLayer.x = -layerPos.x;
        shieldLayer.y = -layerPos.y;

        var hitArea = new Laya.HitArea();
        hitArea.hit.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
        shieldLayer.hitArea = hitArea;
        shieldLayer.mouseEnabled = true;
        shieldLayer.zOrder = -100;

        if(isDispose){
            var dispose = function(){
                layer.close();
            };
            shieldLayer.on(Laya.Event.CLICK, this, dispose);
        }

        return shieldLayer;
    };
    //放大
    UIManager.prototype.doScaleAction = function(uiNode,scale,cb){
        var scale = scale || 1 ;
        uiNode.scaleX = 0;
        uiNode.scaleY = 0;
        var scale_1 = ScaleTo.create(0.1, scale+0.1);
        var scale_2 = ScaleTo.create(0.05, scale);
        
        if (cb){
            var callback = CallFunc.create(Laya.Handler.create(uiNode,cb));
            return App.actionManager.addAction(Sequence.create(scale_1, scale_2,callback),uiNode);
        }

        App.actionManager.addAction(Sequence.create(scale_1, scale_2),uiNode);
    };
    //缩小
    UIManager.prototype.doScaleOutAction = function(uiNode,scale){
        var scale = scale || 1 ;
        uiNode.scaleX = 1;
        uiNode.scaleY = 1;
        var scale_1 = ScaleTo.create(0.05, scale+0.1);
        var scale_2 = ScaleTo.create(0.1, 0);

        App.actionManager.addAction(Sequence.create(scale_1, scale_2),uiNode);
    };

    //上中下结构切入
    UIManager.prototype.doTMBAction = function(top,middle,bottom,cb){
        if(top){
            var endPos = Point.p(top.x, top.y);
            var startPos = Point.p(top.x, top.y - 50);
            top.y = startPos.y;
            top.alpha = 0;

            var move_1 = MoveTo.create(0.2, Point.p(endPos.x, endPos.y));
            var move_2 = MoveTo.create(0.05, endPos);
            var fadeIn = FadeIn.create(0.2);
            if(cb){
                App.actionManager.addAction(Sequence.create(Spawn.create(fadeIn, Sequence.create(move_1, move_2)), CallFunc.create(cb)) , top);
            }else{
                App.actionManager.addAction(Spawn.create(fadeIn, Sequence.create(move_1, move_2)) , top);
            }

        }

        if(middle){
            var endPos = Point.p(middle.x, middle.y);
            var startPos = Point.p(middle.x + 320, middle.y);
            middle.x = startPos.x;
            middle.alpha = 0;

            var move_1 = MoveTo.create(0.2, Point.p(endPos.x - 10, endPos.y));
            var move_2 = MoveTo.create(0.05, endPos);
            var fadeIn = FadeIn.create(0.2);
            if(cb){
                App.actionManager.addAction(Sequence.create(Spawn.create(fadeIn, Sequence.create(move_1, move_2)), CallFunc.create(cb)), middle);
            }else{
                App.actionManager.addAction(Spawn.create(fadeIn, Sequence.create(move_1, move_2)) , middle);
            }
        }

        if(bottom){
            var endPos = Point.p(bottom.x, bottom.y);
            var startPos = Point.p(bottom.x, bottom.y + 50);
            bottom.y = startPos.y;
            bottom.alpha = 0;

            var move_1 = MoveTo.create(0.2, Point.p(endPos.x, endPos.y - 10));
            var move_2 = MoveTo.create(0.05, endPos);
            var fadeIn = FadeIn.create(0.2);
            if(cb){
                App.actionManager.addAction(Sequence.create(Spawn.create(fadeIn, Sequence.create(move_1, move_2)), CallFunc.create(cb)),bottom);
            }else{
                App.actionManager.addAction(Spawn.create(fadeIn, Sequence.create(move_1, move_2)),bottom);
            }
        }
    };
    //上中下结构切出动画
    UIManager.prototype.doTMBFadeOutAction = function(top,middle,bottom){
        if(top){
            var endPos = Point.p(top.x, top.y - 50);

            var move = MoveTo.create(0.25, endPos);
            var fadeOut = FadeOut.create(0.2);
            App.actionManager.addAction(Spawn.create(fadeOut,move),top);
        }

        if(middle){
            var endPos = Point.p(middle.x + 320, middle.y);

            var move = MoveTo.create(0.25, endPos);
            var fadeOut = FadeOut.create(0.2);
            App.actionManager.addAction(Spawn.create(fadeOut,move),middle);
        }

        if(bottom){
            var endPos = Point.p(bottom.x, bottom.y + 50);

            var move = MoveTo.create(0.25, endPos);
            var fadeOut = FadeOut.create(0.2);
            App.actionManager.addAction(Spawn.create(fadeOut,move),bottom);
        }
    },
    //切入
    UIManager.prototype.doDirectionFadeInAction = function(middle,type,length,cb){
        var length = length || 150;

        switch (type){
            case "left":
                var endPos = Point.p(middle.x + length, middle.y);
                middle.alpha = 0;

                var move_1 = MoveTo.create(0.2, Point.p(endPos.x + 10, endPos.y));
                var move_2 = MoveTo.create(0.05, endPos);
                var fadeIn = FadeIn.create(0.2);
                
                App.actionManager.addAction(Spawn.create(fadeIn, Sequence.create(move_1, move_2)),middle);
                break;
            case "right":
                var endPos = Point.p(middle.x - length, middle.y);

                middle.alpha = 0;

                var move_1 = MoveTo.create(0.2, Point.p(endPos.x - 10, endPos.y));
                var move_2 = MoveTo.create(0.05, endPos);
                var fadeIn = FadeIn.create(0.2);
                App.actionManager.addAction(Spawn.create(fadeIn, Sequence.create(move_1, move_2)),middle);
                break;

            case "up":
                var endPos = Point.p(middle.x, middle.y + length);
                middle.alpha = 0;

                var move_1 = MoveTo.create(0.2, Point.p(endPos.x, endPos.y + 10));
                var move_2 = MoveTo.create(0.05, endPos);
                var fadeIn = FadeIn.create(0.2);
                App.actionManager.addAction(Spawn.create(fadeIn, Sequence.create(move_1, move_2)),middle);
                break;


            case "dowm":   
                var endPos = Point.p(middle.x, middle.y - length);
                middle.alpha = 0;

                var move_1 = MoveTo.create(0.2, Point.p(endPos.x, endPos.y - 10));
                var move_2 = MoveTo.create(0.05, endPos);
                var fadeIn = FadeIn.create(0.2);
                
                App.actionManager.addAction(Spawn.create(fadeIn, Sequence.create(move_1, move_2)),middle);
                break;      
        }
    },
    //切出
    UIManager.prototype.doDirectionFadeOutAction = function(middle,type,length){
        var length = length || 150;
        var startPos = Point.p(middle.x, middle.y);

        switch (type){
            case "left":
                var endPos = Point.p(middle.x - length, middle.y);

                var move = MoveTo.create(0.25, endPos);
                var fadeOut = FadeOut.create(0.2);
                App.actionManager.addAction(Spawn.create(fadeOut,move),middle);
                break;
            case "right":
                var endPos = Point.p(middle.x + length, middle.y);

                var move = MoveTo.create(0.25, endPos);
                var fadeOut = FadeOut.create(0.2);
                App.actionManager.addAction(Spawn.create(fadeOut,move),middle);
                break;

            case "up":
                var endPos = Point.p(middle.x, middle.y - length);

                var move = MoveTo.create(0.25, endPos);
                var fadeOut = FadeOut.create(0.2);
                App.actionManager.addAction(Spawn.create(fadeOut,move),middle);
                break;

            case "dowm":   
                var endPos = Point.p(middle.x, middle.y + length);

                var move = MoveTo.create(0.25, endPos);
                var fadeOut = FadeOut.create(0.2);
                App.actionManager.addAction(Spawn.create(fadeOut,move),middle);
                break;    
        }
    },

    UIManager.prototype.getErrString = function (data){
        var msg = "";
        var err = data.err;
        switch (err){
            case Papaya.PokerGo.Game.ERR.NO_READY :{
                msg = "不在游戏开局流程中";
                break
            }
            case Papaya.PokerGo.Game.ERR.NO_DRAW :{
                msg = "不在游戏开牌流程中";
                break
            }

            case Papaya.PokerGo.Game.ERR.NO_BET :{
                msg = "不在游戏押注流程中";
                break
            }

            case Papaya.PokerGo.Game.ERR.NO_BETED :{
                msg = "还没下注";
                break
            }

            case Papaya.PokerGo.Game.ERR.OUT_MAXBET :{
                msg = "超出押注金额上限";
                break
            }

            case Papaya.PokerGo.Game.ERR.BETTYPE_ERR :{
                msg = "押注类型错误";
                break
            }

            case Papaya.PokerGo.Game.ERR.NO_MONEY_ERR :{
                msg = "玩家不够本金押注";
                break
            }

            case Papaya.PokerGo.Game.ERR.NO_BET_MAX_AND_MIN :{
                msg = "没有押注大小";
                break
            }

            case Papaya.PokerGo.Double.ERR.NO_WIN_REWARD :{
                msg = "没有赢得奖励";
                break
            }

            case Papaya.PokerGo.Double.ERR.LOST :{
                msg = "失败不能进行";
                break
            }

            case Papaya.PokerGo.Double.ERR.END :{
                msg = "已经领取奖励";
                break
            }
        }

        return msg;
    };

    return UIManager;
}(laya.events.EventDispatcher));