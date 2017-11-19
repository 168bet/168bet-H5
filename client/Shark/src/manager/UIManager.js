
var UIManager = (function(_super) {
    function UIManager() {
        UIManager.super(this);

    }

    Laya.class(UIManager, "UIManager", _super);

    UIManager.prototype.init = function(callback) {
        callback && callback();
    };

    UIManager.prototype.showMessage = function(msg) {
        var boxMessage = new BoxMessage(msg);

        var onBackOut = function() {
            Laya.stage.removeChild(boxMessage);
            boxMessage.destroy();
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

    return UIManager;
}(laya.events.EventDispatcher));