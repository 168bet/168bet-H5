var RecordBox = (function(_super) {
    function RecordBox() {
        RecordBox.super(this);
    }

    Laya.class(RecordBox, "RecordBox", _super);

    var _proto = RecordBox.prototype;

    _proto.onReader = function() {

    };

    RecordBox.renderHandler = function(cell, index) {
        cell.onRender(cell,index);
    };

    return RecordBox;
}(RecordBoxUI));