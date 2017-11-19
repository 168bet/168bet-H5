
var AssetsManager = (function(_super) {
    var loaderRes = [
        // {
        //     url: "assets/ui.loader/bg.png",
        //     type: Laya.Loader.IMAGE
        // },
        //
        // {
        //     url: "assets/ui.loader/progress.png",
        //     type: Laya.Loader.IMAGE
        // },
        //
        // {
        //     url: "assets/ui.loader/progress$bar.png",
        //     type: Laya.Loader.IMAGE
        // },
        //
        // {
        //     url: "unpack.json",
        //     type: Laya.Loader.JSON
        // }
    ];

    var unpackRes = [

    ];

    var preload = [
        // {
        //     url: "assets/atlas/assets/pokers.json",
        //     type: Laya.Loader.ATLAS
        // },
        //
        // {
        //     url: "assets/atlas/assets/ui.common.json",
        //     type: Laya.Loader.ATLAS
        // },
        //
        // {
        //     url: "assets/atlas/assets/ui.table.json",
        //     type: Laya.Loader.ATLAS
        // },
        //
        // {
        //     url: "assets/atlas/assets/ui.double.json",
        //     type: Laya.Loader.ATLAS
        // },
        //
        // {
        //     url: "assets/atlas/assets/ani.images.json",
        //     type: Laya.Loader.ATLAS
        // }
    ];

    var preloadSounds = [
        // {
        //     url: "assets/sound/bet.mp3",
        //     type: Laya.Loader.SOUND
        // },
        //
        // {
        //     url: "assets/sound/click.mp3",
        //     type: Laya.Loader.SOUND
        // },
        //
        // {
        //     url: "assets/sound/deal.mp3",
        //     type: Laya.Loader.SOUND
        // },
        //
        // {
        //     url: "assets/sound/fail.mp3",
        //     type: Laya.Loader.SOUND
        // },
        // {
        //     url: "assets/sound/flip.mp3",
        //     type: Laya.Loader.SOUND
        // },
        // {
        //     url: "assets/sound/four_of_a_kind.mp3",
        //     type: Laya.Loader.SOUND
        // },
        // {
        //     url: "assets/sound/full_house.mp3",
        //     type: Laya.Loader.SOUND
        // },
        // {
        //     url: "assets/sound/hold.mp3",
        //     type: Laya.Loader.SOUND
        // },
        // {
        //     url: "assets/sound/lucky5.mp3",
        //     type: Laya.Loader.SOUND
        // },
        // {
        //     url: "assets/sound/music.mp3",
        //     type: Laya.Loader.SOUND
        // },
        // {
        //     url: "assets/sound/one_pair.mp3",
        //     type: Laya.Loader.SOUND
        // },
        // {
        //     url: "assets/sound/royal_flush.mp3",
        //     type: Laya.Loader.SOUND
        // },
        // {
        //     url: "assets/sound/streight.mp3",
        //     type: Laya.Loader.SOUND
        // },
        // {
        //     url: "assets/sound/streight_flush.mp3",
        //     type: Laya.Loader.SOUND
        // },
        // {
        //     url: "assets/sound/three_of_a_kind.mp3",
        //     type: Laya.Loader.SOUND
        // },
        // {
        //     url: "assets/sound/two_pair.mp3",
        //     type: Laya.Loader.SOUND
        // },
        // {
        //     url: "assets/sound/unhold.mp3",
        //     type: Laya.Loader.SOUND
        // }
    ];

    var preloadFonts = [
        // {
        //     url: "assets/fonts/colour.fnt",
        //     type: Laya.Loader.XML
        // },
        //
        // {
        //     url: "assets/fonts/golden.fnt",
        //     type: Laya.Loader.XML
        // },
        //
        // {
        //     url: "assets/fonts/violet.fnt",
        //     type: Laya.Loader.XML
        // },
        //
        // {
        //     url: "assets/fonts/white_Gray.fnt",
        //     type: Laya.Loader.XML
        // },
        //
        // {
        //     url: "assets/fonts/white_Violet.fnt",
        //     type: Laya.Loader.XML
        // },
        //
        // {
        //     url: "assets/fonts/bule_Gradient.fnt",
        //     type: Laya.Loader.XML
        // },
        //
        // {
        //     url: "assets/fonts/gray.fnt",
        //     type: Laya.Loader.XML
        // },
        //
        // {
        //     url: "assets/fonts/gray_big.fnt",
        //     type: Laya.Loader.XML
        // },
        //
        // {
        //     url: "assets/fonts/gray_small.fnt",
        //     type: Laya.Loader.XML
        // },
        //
        // {
        //     url: "assets/fonts/golden_orange.fnt",
        //     type: Laya.Loader.XML
        // },
        // {
        //     url: "assets/fonts/white_pink.fnt",
        //     type: Laya.Loader.XML
        // }
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