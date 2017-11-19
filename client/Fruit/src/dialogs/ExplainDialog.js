//*玩法说明界面
var ExplainDialog = (function(_super) {
    function ExplainDialog() {
        ExplainDialog.super(this);
        this.init();
    }

    Laya.class(ExplainDialog, "ExplainDialog", _super);

    ExplainDialog.prototype.initList = function () {
        var list = new laya.ui.List();
        var render = ExplainBox || new laya.ui.Box();

        list.array = [{id:1}, {id:2}, {id:3}, {id:4}];
        list.itemRender = render || new laya.ui.Box();

        list.x = 20;
        list.y = 0;
        list.width = this.imageBox.width;
        list.height = this.imageBox.height;

        list.spaceY = 10;
        list.vScrollBarSkin = "";

        list.renderHandler = render.renderHandler ? new Laya.Handler(render, render.renderHandler) : null;

        this.imageBox.addChild(list);
    };

    ExplainDialog.prototype.init = function() {
        this.initList();
        App.assetsManager.playSound("open_scene");
    };
    
    ExplainDialog.prototype.removeEvent = function () {

    };

    ExplainDialog.prototype.close = function() {
        App.assetsManager.playSound("chose_machine");
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
        this.removeEvent();
    };

    return ExplainDialog;
}(ExplainDialogUI));