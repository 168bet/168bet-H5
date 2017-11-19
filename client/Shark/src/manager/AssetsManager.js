
var AssetsManager = (function(_super) {
    var loaderRes = [
        {
            url: "assets/ui.Loader/loaderBg.jpg",
            type: Laya.Loader.IMAGE
        },

        {
            url: "assets/ui.Loader/loaderFish.png",
            type: Laya.Loader.IMAGE
        },

        {
            url: "assets/ui.Loader/progress.png",
            type: Laya.Loader.IMAGE
        },

        {
            url: "assets/ui.Loader/progress$bar.png",
            type: Laya.Loader.IMAGE
        },

        {
            url: "unpack.json",
            type: Laya.Loader.JSON
        }
    ];

    var unpackRes = [

    ];

    var preload = [
        {
            "url": "assets/assets/ui.common.json",
            "type": Laya.Loader.ATLAS
        },

        {
            "url": "assets/ui.bg/bg1.jpg",
            "type": Laya.Loader.IMAGE
        },

        {
            "url": "assets/ui.bg/bg2.jpg",
            "type": Laya.Loader.IMAGE
        },

        {
            "url": "assets/ui.bg/bg3.jpg",
            "type": Laya.Loader.IMAGE
        },

        {
            "url": "assets/ui.bg/bg4.jpg",
            "type": Laya.Loader.IMAGE
        },

        {
            "url": "assets/ui.bg/bg4.jpg",
            "type": Laya.Loader.IMAGE
        },

        {
            "url": "assets/ui.common/goldBg.png",
            "type": Laya.Loader.IMAGE
        },

        {
            "url": "assets/ui.common/lowBg.png",
            "type": Laya.Loader.IMAGE
        },

        {
            "url": "assets/ui.common/upBg.png",
            "type": Laya.Loader.IMAGE
        },

        {
            "url": "assets/ui.Loader/loaderBg.jpg",
            "type": Laya.Loader.IMAGE
        }
    ];

    var preloadSounds = [
        {
            url: "assets/ui.sounds/bgm_go.mp3",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/ui.sounds/music_blue_loading.mp3",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/ui.sounds/music_fail.mp3",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/ui.sounds/music_go.mp3",
            type: Laya.Loader.SOUND
        },
        {
            url: "assets/ui.sounds/music_map1.mp3",
            type: Laya.Loader.SOUND
        },
        {
            url: "assets/ui.sounds/music_map2.mp3",
            type: Laya.Loader.SOUND
        },
        {
            url: "assets/ui.sounds/music_map3.mp3",
            type: Laya.Loader.SOUND
        },
        {
            url: "assets/ui.sounds/music_map4.mp3",
            type: Laya.Loader.SOUND
        },
        {
            url: "assets/ui.sounds/music_win.mp3",
            type: Laya.Loader.SOUND
        },
        {
            url: "assets/ui.sounds/music_win10X.mp3",
            type: Laya.Loader.SOUND
        },
        {
            url: "assets/ui.sounds/sound_getcoins.mp3",
            type: Laya.Loader.SOUND
        },
        {
            url: "assets/ui.sounds/sound_hit.mp3",
            type: Laya.Loader.SOUND
        },
        {
            url: "assets/ui.sounds/sound_ranking.mp3",
            type: Laya.Loader.SOUND
        }
    ];

    var preloadFonts = [
        {
            url: "assets/ui.fonts/black_white.fnt",
            type: Laya.Loader.XML
        },

        {
            url: "assets/ui.fonts/golden.fnt",
            type: Laya.Loader.XML
        },

        {
            url:"assets/ui.fonts/orange_yellow.fnt",
            type: Laya.Loader.XML
        },

        {
            url: "assets/ui.fonts/sky_blue.fnt",
            type: Laya.Loader.XML
        },

        {
            url: "assets/ui.fonts/white.fnt",
            type: Laya.Loader.XML
        },

        //{
        //    url: "assets/ui.fonts/white_loader.fnt",
        //    type: Laya.Loader.XML
        //},

        {
            url: "assets/ui.fonts/yellow.fnt",
            type: Laya.Loader.XML
        },

        {
            url: "assets/ui.fonts/win_font.fnt",
            type: Laya.Loader.XML
        }
    ];

    function AssetsManager() {
        AssetsManager.super(this);

        this.sounds = {};
        this.fonts  = {};
    }

    Laya.class(AssetsManager, "AssetsManager", _super);

    var __proto = AssetsManager.prototype;

    __proto.init = function(cb) {
        var i, size, obj, url, start, len, name;

        // 注册声音文件索引
        for (i = 0, size = preloadSounds.length; i < size; i++) {
            obj = preloadSounds[i];
            url = obj.url;

            start = url.lastIndexOf("/") + 1;
            len = url.lastIndexOf(".") - start;

            name = url.substr(url.lastIndexOf("/") + 1, url.lastIndexOf(".") - start);

            this.sounds[name] = url;
        }

        // 注册字体文件索引
        for (i = 0, size = preloadFonts.length; i < size; i++) {
            obj = preloadFonts[i];
            url = obj.url;

            start = url.lastIndexOf("/") + 1;
            len = url.lastIndexOf(".") - start;

            name = url.substr(url.lastIndexOf("/") + 1, url.lastIndexOf(".") - start);

            this.fonts[name] = url;
        }

        // 注册字体文件
        var self = this;
        var keys = Object.keys(this.fonts);
        async.eachSeries(keys, function(name, callback) {
            var url = self.fonts[name];
            var bmpFont = new Laya.BitmapFont();

            var xml = Laya.loader.getRes(url);
            var texture = Laya.loader.getRes(url.replace('.fnt', '.png'));
            bmpFont.parseFont(xml, texture);

            Laya.Text.registerBitmapFont(name, bmpFont);

            callback(null);

        }, function(err) {
            if (err != null) {
                console.log("assetManager init error...");
            }

            cb && cb();
        });
    };

    __proto.getLoaderRes = function() {
        return loaderRes;
    };

    __proto.getPreload = function() {
        var i, size;
        var resource = {
            images:   [],
            sounds:   [],
            fonts:    []
        };

        if (unpackRes.length === 0) {
            var unpack = Laya.loader.getRes("unpack.json");
            if (unpack != null) {
                for (i = 0, size = unpack.length; i < size; i++) {
                    unpackRes.push({
                        url: unpack[i],
                        type: Laya.Loader.IMAGE
                    })
                }
            }
        }

        resource.images = preload.concat(unpackRes);
        resource.sounds = preloadSounds.slice(0);
        resource.fonts  = preloadFonts.slice(0);

        for (i = 0, size = preloadFonts.length; i < size; i++) {
            resource.fonts.push({
                url: preloadFonts[i].url.replace('.fnt', '.png'),
                type: Laya.Loader.IMAGE
            })
        }

        return resource;
    };

    __proto.getSound = function(name) {
        return this.sounds[name] || "";
    };

    __proto.getFont = function(name) {
        return this.fonts[name] || "";
    };

    __proto.playMusic = function(name) {
        var url = this.getSound(name);
        url && Laya.SoundManager.playMusic(url);
    };

    __proto.playSound = function(name) {
        var url = this.getSound(name);
        url && Laya.SoundManager.playSound(url);
    };

    return AssetsManager;
}(laya.events.EventDispatcher));