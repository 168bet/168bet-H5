/**
 * Created by WhelaJoy on 2017/2/21.
 */
var BoxMessage = (function (_super){
    function BoxMessage(s){
        BoxMessage.super(this);

        this.pivotX = this.width/2;
        this.pivotY = this.height/2;
        this.x = Laya.stage.width/2;
        this.y = Laya.stage.height/2;

        this.textMessage.text = s;
    }
    Laya.class(BoxMessage,"BoxMessage",_super);

    BoxMessage.prototype.setText = function(s) {
        this.textMessage.text = s;
    };

    return BoxMessage
})(BoxMessageUI);