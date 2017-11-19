
var MessageDialog = (function(_super) {
    function MessageDialog(score) {
        MessageDialog.super(this);

        this.score = score;

        this.init();
    }

    Laya.class(MessageDialog, "MessageDialog", _super);

    MessageDialog.prototype.init = function() {

        this.labelScore.text = 0;

        this.closeHandler = Laya.Handler.create(this, this.onClose);

        this.on(Laya.Event.DISPLAY, this, this.onDisplay);
    };

    MessageDialog.prototype.onDisplay = function() {
        // App.actionManager.add();
    };

    MessageDialog.prototype.onClose = function(name) {
    };

    return MessageDialog;
}(MessageDialogUI));