var window = window || global;

(function () {
    // 设计宽度和高度
    var designW = 1440;
    var designH = 900;

    // 初始化Laya
    Laya.init(designW, designH, Laya.WebGL);
       
    // 设置屏幕缩放模式
    Laya.stage.scaleMode = laya.display.Stage.SCALE_SHOWALL;
       
    // 设置屏幕为竖屏幕模式
    Laya.stage.screenMode = laya.display.Stage.SCREEN_HORIZONTAL;
       
    // 设置舞台的对齐方式
    Laya.stage.alignH = laya.display.Stage.ALIGN_CENTER;
    Laya.stage.alignV = laya.display.Stage.ALIGN_MIDDLE;

    // 创建应用
    var app = window.App = Application;

    // 加载配置文件
    Laya.loader.load("project.json", Laya.Handler.create(null, Main), null, null, 1, false);

    // 主程序入口
    function Main(config) {
        var config = app.config = config;

        // 打开监视窗口
        if (config.showFPS) {
            Laya.Stat.show();
        }

        // 初始化应用
        app.init();

        // 预先加载加载画面的资源
        Laya.loader.load(app.assetsManager.getLoaderRes(), Laya.Handler.create(window.App, window.App.start));

    }
}());
