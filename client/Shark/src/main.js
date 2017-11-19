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

    // 打开监视窗口
    //Laya.Stat.show();


    //function initManager() {
    //    var getter,setter;
    //    var eventManager = new EventMgr();		//事件管理器
    //    getter = function() {
    //        return eventManager;
    //    };
    //
    //    setter = function(m) {
    //        eventManager = m;
    //    };
    //
    //    Laya.getset(true, Shark, "eventManager", getter, setter);
    //
    //    var frameAniMgr = new FrameAniMgr();		//帧动画管理器
    //    getter = function() {
    //        return frameAniMgr;
    //    };
    //
    //    setter = function(m) {
    //        frameAniMgr = m;
    //    };
    //
    //    Laya.getset(true, Shark, "frameAniMgr", getter, setter);
    //
    //    var actionManager = new ActionManager();
    //    getter = function() {
    //        return actionManager;
    //    };
    //    setter = function(m) {
    //        actionManager = m;
    //    };
    //
    //    Laya.getset(true, Shark, "actionManager", getter, setter);
    //
    //    var pathMgr2 = new PathMgr2();
    //    getter = function() {
    //        return pathMgr2;
    //    };
    //    setter = function(m) {
    //        pathMgr2 = m;
    //    };
    //
    //    Laya.getset(true, Shark, "pathMgr2", getter, setter);
    //
    //}

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

        //console.log("Fishing.Event.INITED = " + Shark.Event.INITED);
        app.init();

        // 预先加载加载画面的资源
        Laya.loader.load(app.assetsManager.getLoaderRes(), Laya.Handler.create(window.App, window.App.start));
    }

    // 预先加载加载画面的资源
    //Laya.loader.load(root.loaderRes, Laya.Handler.create(null, onLoaded));

    // 创建应用
    //var app = root.application =  new Application();

    //var index = 0;
    //var jsFiles = window.jsFilesLoader;
    //var body = laya.utils.Browser.document.getElementById('body');
    //function onLoaded(index) {
    //    if(!jsFiles[index])
    //    {
    //        gameStart();
    //        return;
    //    }
    //
    //    var script = document.createElement('script');
    //    script.type= 'text/javascript';
    //    script.src = jsFiles[index];
    //    body.appendChild(script);
    //
    //    script.onload = script.onreadystatechange  = function() {
    //        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" )
    //        {
    //            ++index;
    //            onLoaded(index);
    //        }
    //    }
    //}
    //
    //onLoaded(index);
}());
