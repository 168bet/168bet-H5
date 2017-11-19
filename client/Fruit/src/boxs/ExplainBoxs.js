/**
 * 玩法说明
 */
var ExplainBox = (function(_super) {
    function ExplainBox() {
        ExplainBox.super(this);
        this._boxsList = [];
        this.getBoxs();
    }

    Laya.class(ExplainBox, "ExplainBox", _super);

    ExplainBox.prototype.getBoxs = function () {
        for (var i = 0; i < 5; i++) {
            var box = this.getChildByName("explainBox_" + i);
            this._boxsList.push(box);
        }
    };

    ExplainBox.renderHandler = function(cell, index) {
        cell.onRender(cell,index);
    };

    ExplainBox.prototype.onRender = function (cell, index) {
        var data = cell.dataSource;
        if (!data) {
            return;
        }

        var id = data.id;

        for (var i = 1; i < 5; i ++) {
            if (id == i) {
                this._boxsList[id].visible = true;
            }
            else {
                this._boxsList[i].visible = false;
            }
        }
    };

    return ExplainBox;
}(ExplainBox1UI));
