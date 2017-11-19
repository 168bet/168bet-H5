(function(root) {
    var _super = root.EventDispatcher;

    var Serialize = root.Serialize = function(opts) {
        opts = opts || {};

        _super.call(this, opts);
    };

    root.inherits(Serialize, _super);

    root.extend(Serialize.prototype, {
        inspector: function(obj) {
            if (obj == null) {
                return obj;
            }

            if (typeof obj !== 'object') {
                return obj;
            }

            if (obj instanceof Array) {
                var new_arr = [];

                for (var i in obj) {
                    if (typeof obj[i] === 'object') {
                        new_arr[i] = this.inspector(obj[i]);
                    } else {
                        new_arr[i] = obj[i];
                    }
                }

                return new_arr;
            }

            if (typeof obj.clone === 'function') {
                return obj.clone();
            }

            var new_obj = {};
            for (var key in obj) {
                var val = obj[key];
                if (typeof val === 'object') {
                    new_obj[key] = this.inspector(val);
                } else {
                    if (obj.hasOwnProperty(key)) {
                        new_obj[key] = val;
                    }
                }
            }

            return new_obj;
        },

        clone: function() {
            var obj = {};

            for (var key in this) {
                var val = this[key];

                if (this.hasOwnProperty(key) == false) {
                    continue;
                }

                if (key[0] == '_') {
                    continue;
                }

                obj[key] = this.inspector(val);
            }

            return obj;
        },

        toString: function() {
            return JSON.stringify(this.clone());
        },

        sync: function(opts) {
            for (var key in opts) {
                if (this.hasOwnProperty(key)) {
                    this[key] = opts[key];
                }
            }
        }
    });
}(Papaya));