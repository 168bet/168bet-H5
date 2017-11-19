/**
 *  单例模式
 */
var Application = (function (_super) {
    function Application() {
    }

    Application.init = function() {
        // private members
        this._runningView = null;

        // Managers
        this.actionManager       = new ActionManager();
        this.assetsManager       = new AssetsManager();
        this.storageManager      = new StorageManager();
        this.netManager          = this["config"]["singleAlone"] ? new SingleAlone() : new NetManager();
        this.uiManager           = new UIManager();
        this.animManager         = new AnimationManager();

        // Controllers
        this.game = new Papaya.DiamondDeal.Game();

        // Modules
        this.player = null;

        // Layers
        this.sceneLayer = new Laya.Sprite();
        this.sceneLayer.zOrder = 1;
        Laya.stage.addChild(this.sceneLayer);

        // Views
        this.loaderView = null;
        //this.messageView = null;
        //this.logView = null;

        this.state = Application.STATE_INITED;
        console.log('application inited...');
    };

    Application.preload = function() {
        var self = this;

        this.state = Application.STATE_PRELOADING;
        this.runView(this.loaderView);

        var resources = this.assetsManager.getPreload();
        async.series([
            function (callback) {
                self.loaderView.setText("正在初始化网络......");
                self.netManager.init(function() {
                    callback(null);
                });
            },

            function (callback) {
                self.loaderView.setText("正在加载图片......");

                var onComplete = function () {
                    callback(null);
                };
                var onProgress = function (e) {
                    self.loaderView.changeValue(e);
                };

                Laya.loader.load(resources.images, Laya.Handler.create(null, onComplete), Laya.Handler.create(null, onProgress, null, false));
            },

            function (callback) {
                self.loaderView.setText("正在加载音乐音效......");

                if(resources.sounds.length == 0)
                {
                    callback(null);
                };

                var onComplete = function () {
                    callback(null);
                };
                var onProgress = function (e) {
                    self.loaderView.changeValue(e);
                };

                Laya.loader.load(resources.sounds, Laya.Handler.create(null, onComplete), Laya.Handler.create(null, onProgress, null, false));
            },

            function(callback) {
                self.loaderView.setText("正在加载字体......");

                if(resources.fonts.length == 0)
                {
                    callback(null);
                    return;
                };

                var onComplete = function () {
                    callback(null);
                };
                var onProgress = function (e) {
                    self.loaderView.changeValue(e);
                };

                Laya.loader.load(resources.fonts, Laya.Handler.create(null, onComplete), Laya.Handler.create(null, onProgress, null, false));
            },

            function(callback) {
                self.loaderView.setText("正在初始化资源......");
                self.assetsManager.init(function() {
                    callback(null);
                });
            },

            function(callback) {
                self.loaderView.setText("正在初始化界面......");
                self.uiManager.init(function() {
                    callback(null);
                });
            },

            function(callback) {
                self.loaderView.setText("正在初始化动画......");
                self.animManager.init(function() {
                    callback(null);
                });
            }

        ], function(err, results) {
            console.log("assets loaded...");

            self.state = Application.STATE_PRELOADED;

            self.battleView          = new BattleView();
            self.betView             = new BetView();

            App.assetsManager.playMusic("music");
        });
    };

    Application.connectServer = function() {
        this.state = Application.STATE_CONNECTED;
        return;

        var self = this;

        self.state = Application.STATE_CONNECTING;
        self.loaderView.setText("连接游戏服务器...");

        var onConnected = function() {
            self.loaderView.setText("连接成功!");
            self.state = Application.STATE_CONNECTED;
            console.log("game server connected...");
        };

        var onError = function() {
            console.log("error");
        };

        self.netManager.connectServer();
        self.netManager.once(SocketIO.CONNECTED, null, onConnected);
        self.netManager.once(SocketIO.ERROR, null, onError);
    };

    Application.accountAuth = function() {
        var self = this;
        var onComplete = function(err, data) {
            if (err != null) {
                Laya.timer.once(1000, self, self.accountAuth);
                return;
            }
            self.state = Application.STATE_AUTHORIZED;
            self.loaderView.setText("授权成功!");

            console.log("account authed...", data);
        };

        self.loaderView.setText("正在获取授权...");
        this.state = Application.STATE_AUTHORIZING;

        this.netManager.accountAuth(Laya.Handler.create(null, onComplete));
    };

    Application.accountSync = function() {
        var self = this;
        var onComplete = function(err, data) {
            if (err != null) {
                Laya.timer.once(1000, self, self.accountSync);
                return;
            }

            data.player.balance = Math.floor(Number(data.player.balance));
            self.player = new Papaya.Player(data.player);
            self.state = Application.STATE_SYNCHRONIZED;
            self.loaderView.setText("同步成功!");

            console.log("account synced...", data);
        };

        self.loaderView.setText("正在同步账号...");
        this.state = Application.STATE_SYNCHRONIZING;

        this.netManager.accountSync(Laya.Handler.create(null, onComplete));
    };

    Application.enter = function() {
        var self = this;

        var onComplete = function(err, data) {
            if (err != null) {
                Laya.timer.once(1000, self, self.enter);
                return;
            }

            self.loaderView.setText("进入成功!");

            if(!data.nothing)
            {
                self.inheritLastTime(data);
                self.state = Application.STATE_RUNNING;
            }
            else
            {
                self.state = Application.STATE_ENTERED;
            }

            console.log("account entered...", JSON.stringify(data));
        };

        self.loaderView.setText("正在进入游戏...");
        this.state = Application.STATE_ENTERING;

        var api = "/diamondDeal/enter";
        var params = {};
        this.netManager.request(api, params, Laya.Handler.create(null, onComplete));
    };

    Application.inheritLastTime = function(data){
        this.runView(this.battleView);
        this.battleView.inheritLastTime(data);
    };

    Application.getRunView = function() {
        return this._runningView;
    };

    Application.runView = function(view) {
        if (this._runningView) {
            this.sceneLayer.removeChild(this._runningView);
            this._runningView.dispose();
        }

        this._runningView = view;
        this.sceneLayer.addChild(this._runningView);
    };

    Application.start = function() {
        // 创建加载场景
        this.loaderView = new LoaderView();

        Laya.timer.frameLoop(1, this, this.loop);

        this.state = Application.STATE_STARTED;
        console.log('application started...');
    };

    Application.stop = function() {

    };

    Application.runBetView = function() {
        this.runView(this.betView);
        this.betView.init();
        this.state = Application.STATE_RUNNING;
    };

    Application.runBattleView = function(data) {
        this.runView(this.battleView);
        //this.battleView.init();
        this.battleView.gameStart(data);
        this.state = Application.STATE_RUNNING;
    };

    Application.loop = function() {
        var running = false;
        var dt = Laya.timer.delta;

        switch (this.state) {
            case Application.STATE_STARTED:
                this.preload();
                break;
            case Application.STATE_PRELOADING:
                break;
            case Application.STATE_PRELOADED:
                this.connectServer();
                break;
            case Application.STATE_CONNECTING:
                break;
            case Application.STATE_CONNECTED:
                this.accountAuth();
                break;
            case Application.STATE_AUTHORIZING:
                break;
            case Application.STATE_AUTHORIZED:
                this.accountSync();
                break;
            case Application.STATE_SYNCHRONIZING:
                break;
            case Application.STATE_SYNCHRONIZED:
                this.enter();
                break;
            case Application.STATE_ENTERING:
                break;
            case Application.STATE_ENTERED:
                this.runBetView();
                //this.runBattleView();
                break;
            case Application.STATE_RUNNING:
                running = true;
                break;
        }

        if (!running) {
            return;
        }

        this._runningView.update && this._runningView.update(dt);
    };

    Application.STATE_INITED           = 1;
    Application.STATE_STARTED          = 2;
    Application.STATE_PRELOADING       = 3;
    Application.STATE_PRELOADED        = 4;
    Application.STATE_CONNECTING       = 5;
    Application.STATE_CONNECTED        = 6;
    Application.STATE_AUTHORIZING      = 7;
    Application.STATE_AUTHORIZED       = 8;
    Application.STATE_SYNCHRONIZING    = 9;
    Application.STATE_SYNCHRONIZED     = 10;
    Application.STATE_ENTERING         = 11;
    Application.STATE_ENTERED          = 12;

    Application.STATE_RUNNING          = 100;


    Application.Event                  = {};

    return Application;
}());