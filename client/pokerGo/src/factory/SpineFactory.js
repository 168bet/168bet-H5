/*
* name;
*/
var SpineFactory = (function (_super) {
    function SpineFactory(name, resource) {
        SpineFactory.super(this);

        this.name = name + "Factory";
        this.resource = resource;
        this.factorys = {};
    }

    Laya.class(SpineFactory, "SpineFactory", _super);

    SpineFactory.prototype.init = function() {
        var self = this;
        var idArray = Object.keys(this.resource);
        var done = 0;
        var total = idArray.length;
        var iterator = function(id, callback) {
            var factory = new Laya.Templet();
            var path = self.resource[id].path;

            var onComplete = function(id) {
                done++;
                self.event(SpineFactory.Event.PROGRESS, done/total);
                callback(null);
            };
            var onError = function(id) {
                callback(null);
            };

            factory.loadAni(path);
            factory.on(Laya.Event.COMPLETE, null, onComplete, [id]);
            factory.on(Laya.Event.ERROR, null, onError, [id]);

            self.factorys[id] = factory;
        };

        async.eachSeries(idArray, iterator, function(err) {
            if (err != null) {
                console.log(self.name, "init error...", err);
                return;
            }

            console.log(self.name, "inited...");

            self.event(SpineFactory.Event.INITED);
        });
    };

    SpineFactory.prototype.getAnimation = function(id, mode) {
        mode = mode || 0;
        var factory = this.factorys[id];
        if (factory == null) {
            return null;
        }

        return factory.buildArmature(mode);
    };

    SpineFactory.prototype.getFactory = function(id) {
        return this.factorys[id];
    };

    SpineFactory.Event = {}
    SpineFactory.Event.PROGRESS = "progress";
    SpineFactory.Event.INITED   = "inited";

    return SpineFactory;
}(Laya.EventDispatcher));