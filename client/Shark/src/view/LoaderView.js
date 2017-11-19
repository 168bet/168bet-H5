var LoaderView = (function(_super) {
    function LoaderView() {
        LoaderView.super(this);

        this.init();
    }

    Laya.class(LoaderView, "LoaderView", _super);

    LoaderView.prototype.init = function() {

    };

    LoaderView.prototype.start = function() {
        this.progress.value = 0;
        this.percent.text = "0A";
        this.percent.font = "white_loader";
        this.show();
    };

    LoaderView.prototype.stop = function() {
        Laya.timer.once(1000, this, this.hide);
    };

    LoaderView.prototype.changeValue = function(v) {
        // console.log("loader changeValue");
        this.progress.value = v;
        this.percent.text = String((v * 100).toFixed(0)) + "A";
        this.imageFish.x = v*600;
    };

    LoaderView.prototype.show = function() {
        function onFontLoaded(bitmapFont)
        {
            //bitmapFont.setSpaceWidth(10);
            Laya.Text.registerBitmapFont("white_loader", bitmapFont);
            this.progress.value = 0;
            this.percent.text = "0A";
            this.percent.font = "white_loader";
            //Laya.stage.addChild(this);
        }

        var bmpFont = new Laya.BitmapFont();

        bmpFont.loadFont("assets/ui.fonts/white_loader.fnt", Laya.Handler.create(this, onFontLoaded, [bmpFont]));
    };

    LoaderView.prototype.hide = function() {
        Laya.stage.removeChild(this);
    };

    LoaderView.prototype.setText = function(s) {
        this.message.text = s;
    };

    return LoaderView;
}(LoaderViewUI));