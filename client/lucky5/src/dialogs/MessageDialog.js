
var MessageDialog = (function(_super) {
    function MessageDialog(score) {
        MessageDialog.super(this);

        // sprites
        this.logo               = new LogoBox();

        // values
        this.score              = score;

        this.init();
    }

    Laya.class(MessageDialog, "MessageDialog", _super);

    MessageDialog.prototype.init = function() {
        // 初始化Logo
        var sprite = this.getChildByName('bg_logo');
        this.logo.scale(1.3, 1.3);
        this.logo.pivot(this.logo.width/2, this.logo.height/2);
        this.logo.top = -8;
        this.logo.left = 30;
        sprite.addChild(this.logo);

        this.labelScore.text = 0;

        this.btnDouble.on(Laya.Event.MOUSE_DOWN, this, this.onDoubleClick);
        this.closeHandler = Laya.Handler.create(this, this.onClose);

        this.on(Laya.Event.DISPLAY, this, this.onDisplay);
    };

    MessageDialog.prototype.onDisplay = function() {
        App.actionManager.add(
            NumberTo.create(0.5, 0, this.score),
            this.labelScore
        );
    };

    MessageDialog.prototype.onDoubleClick = function() {
        var self = this;
        var complete = function(err, data) {
            if (err != null) {
                return;
            }

            App.setDoubleData(data);
            App.runDoubleView();
            self.close();
        };
        var api = "/lucky5/double";
        var params = {};
        App.netManager.request(api, params, Laya.Handler.create(null, complete));
    };

    MessageDialog.prototype.onClose = function(name) {
    };

    return MessageDialog;
}(MessageDialogUI));