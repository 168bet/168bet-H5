
var AssetsManager = (function(_super) {
    var loaderRes = [
        {
            url: "assets/bg.png",
            type: Laya.Loader.IMAGE
        },

        {
            url: "assets/ui.loader/progress.png",
            type: Laya.Loader.IMAGE
        },

        {
            url: "assets/ui.loader/progress$bar.png",
            type: Laya.Loader.IMAGE
        },

        {
            url: "assets/ui.loader/img_loading.png",
            type: Laya.Loader.IMAGE
        },

        {
            url: "assets/sound/loading.mp3",
            type: Laya.Loader.SOUND
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
            url: "assets/atlas/assets/ui.button.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.images.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.label.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.main.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.record.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.explain.json",
            type: Laya.Loader.ATLAS
        },
    ];
    
    var preloadSounds = [
        {
            url: "assets/sound/loading.mp3",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/balance_chip.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C01.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C02.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C03.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C04.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C05.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C06.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C07.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C08.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C09.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C10.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C11.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C12.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C13.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C14.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C15.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C121.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C122.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C123.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/C124.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/chip_in_fail.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/chip_switch.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/chose_machine.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/collect_coin_in.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/hit.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/medal_upgrade.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/open_scene.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/pop_coin.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/push_coin.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y001.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y001-1.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y001-2.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y001-3.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y001-4.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y001-5.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y001-6.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y002.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y003.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y004.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y005.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y006.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y007.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y008.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y009.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y010.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y011.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y012.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y013.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y014.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y015.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y016.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y017.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y018.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y019.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y020.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y021.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y022.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y023.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y024.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y025.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y026.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y027.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y028.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y029.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y030.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y031.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y032.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y033.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Apple.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Orange.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Pomelo.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Bell.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Watermelon.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Star.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/77.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/GG.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y109.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y110.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y111.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y112.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y113.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y114.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y115.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y116.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y117.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y118.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y119.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y120.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y121.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y122.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y123.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y124.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y125.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y126.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y127.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y128.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y130.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y131.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y132.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y133.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/GG_Btn.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/77_Btn.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Star_Btn.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Watermelon_Btn.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Bell_Btn.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Pomelo_Btn.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Orange_Btn.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Apple_Btn.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y209.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y210.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y211.ogg",
            type: Laya.Loader.SOUND
        },

        {
            url: "assets/sound/Y212.ogg",
            type: Laya.Loader.SOUND
        }
    ];
    
    var preloadFonts = [
        {
            url: "assets/fonts/brown.fnt",
	        type: Laya.Loader.XML
        },

        {
            url: "assets/fonts/red.fnt",
	        type: Laya.Loader.XML
        },

        {
            url: "assets/fonts/white.fnt",
	        type: Laya.Loader.XML
        },

        {
            url: "assets/fonts/yellow.fnt",
	        type: Laya.Loader.XML
        }
    ];

    var preloadEffects = (function () {
        var effectResources = {};
        var idArray = [
            10001,
            10002,
            10003
        ];

        for (var i = 0, size = idArray.length; i < size; i++) {
            var id = idArray[i];
            var path = "assets/ani.effects/" + id + "/poacher.sk";

            effectResources[id] = {
                id: id,
                path: path
            }
        }

        return effectResources;
    }());

    function AssetsManager() {
        AssetsManager.super(this);
        this.sounds = {};
        this.fonts  = {};
    }

    Laya.class(AssetsManager, "AssetsManager", _super);

    var __proto = AssetsManager.prototype;

    __proto.init = function(cb) {
        var i, size, obj, url, start, len, name;

        // ע�������ļ�����
        for (i = 0, size = preloadSounds.length; i < size; i++) {
            obj = preloadSounds[i];
            url = obj.url;

            start = url.lastIndexOf("/") + 1;
            len = url.lastIndexOf(".") - start;

            name = url.substr(url.lastIndexOf("/") + 1, url.lastIndexOf(".") - start);

            this.sounds[name] = url;
        }

        // ע�������ļ�����
        for (i = 0, size = preloadFonts.length; i < size; i++) {
            obj = preloadFonts[i];
            url = obj.url;

            start = url.lastIndexOf("/") + 1;
            len = url.lastIndexOf(".") - start;

            name = url.substr(url.lastIndexOf("/") + 1, url.lastIndexOf(".") - start);

            this.fonts[name] = url;
        }

        // ע�������ļ�
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

    __proto.getEffectsRes = function (){
        return preloadEffects;
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

    __proto.playSound = function(name, loop) {
        var url = this.getSound(name);
        if (!loop) {
            loop = 1;
        }
        url && Laya.SoundManager.playSound(url, loop);
    };
    return AssetsManager;
}(laya.events.EventDispatcher));