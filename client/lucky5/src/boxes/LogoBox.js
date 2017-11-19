var LogoBox = (function(_super) {
    function LogoBox() {
        LogoBox.super(this);

        this.animations = [];

        this.init();
    }

    Laya.class(LogoBox, "LogoBox", _super);

    var __proto = LogoBox.prototype;

    __proto.init = function() {
        var names = [
            "ani.table.five", "ani.blue.light", "ani.table.win", "ani.blink.star"
        ];
        var offsetX = 0;
        var offsetY = 0;

        for (var i = 0, size = names.length; i < size; i++) {
            var name = names[i];
            var anim = App.animManager.get(name);
            var sprite = this.getChildByName(name);

            anim.x = offsetX;
            anim.y = offsetY;

            sprite.addChild(anim);
            anim.play();

            this.animations.push(anim);
        }
    };

    return LogoBox;
}(LogoBoxUI));