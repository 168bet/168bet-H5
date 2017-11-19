var LoaderView = (function(_super) {
    function LoaderView() {
        LoaderView.super(this);

        this.init();
    }

    Laya.class(LoaderView, "LoaderView", _super);

    LoaderView.prototype.init = function() {
        this.progress.value = 0;
        var mAniPath = "assets/ani.effects/100001/poacher.sk";
        var mFactory = new Laya.Templet();
        mFactory.loadAni(mAniPath);
        mFactory.on(Laya.Event.COMPLETE, this, this.initAction);
        this.mFactory = mFactory;
        Laya.SoundManager.playMusic("assets/sound/loading.mp3");
    };

    LoaderView.prototype.completeHandler = function () {
        this.event("logoActionStop");
    };

    LoaderView.prototype.initAction = function () {
        var mArmature = this.mFactory.buildArmature(1);
        mArmature.on(Laya.Event.STOPPED, this, this.completeHandler);
        mArmature.x = this.actionNode.x;
        mArmature.y = this.actionNode.y + 400;
        this.addChild(mArmature);
        mArmature.play(0, false);
    };

    LoaderView.prototype.start = function() {
        this.progress.value = 0;
        this.percent.text = "0%";
        this.message.text = "";
        this.show();
    };

    LoaderView.prototype.stop = function() {
        Laya.timer.once(1000, this, this.hide);
    };

    LoaderView.prototype.changeValue = function(v) {
        this.progress.value = v;
        this.percent.text = String((v * 100).toFixed(2)) + "%";
    };

    LoaderView.prototype.show = function() {
        Laya.stage.addChild(this);
    };

    LoaderView.prototype.hide = function() {
        Laya.stage.removeChild(this);
    };

    LoaderView.prototype.setText = function(s) {
        //this.message.text = s;
    };

    return LoaderView;
}(LoaderViewUI));