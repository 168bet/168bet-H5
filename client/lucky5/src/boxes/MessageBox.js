
var MessageBox = (function (_super) {
    function MessageBox(s) {
        MessageBox.super(this);
        
        this.pivotX = this.width/2;
        this.pivotY = this.height/2;
        this.x = Laya.stage.width/2;
        this.y = Laya.stage.height/2;
        
        this.textMessage.text = s;
    }

    Laya.class(MessageBox, "BoxMessage", _super);

    MessageBox.prototype.setText = function(s) {
        this.textMessage.text = s;
    };

    return MessageBox;
}(MessageBoxUI));