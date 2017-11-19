var StorageManager = (function(_super) {
    var AppKey = "EdSIlrzBmUE2I4XPBVACUWN9v0JVzrjqWu7Y";
    
    function StorageManager() {
        this.storage = localStorage || {};
        this.aesKey = CryptoJS.enc.Utf8.parse(AppKey);

        this.init();
    }

    Laya.class(StorageManager, "StorageManager", _super);

    StorageManager.prototype.init = function() {
    };

    StorageManager.prototype.encrypt = function(value) {
        return CryptoJS.AES.encrypt(value, this.aesKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
    };

    StorageManager.prototype.decrypt = function(value) {
        return CryptoJS.AES.decrypt(value, this.aesKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
    };

    StorageManager.prototype.getItem = function(key, decode) {
        var value = this.storage[key];
        if (value == undefined) {
            return undefined;
        }

        return decode? this.decrypt(value) : value;
    };

    StorageManager.prototype.setItem = function(key, value, encode) {
        this.storage[key] = encode ? this.encrypt(value) : value;
    };

    StorageManager.prototype.getDeviceId = function() {
        var key = StorageManager.KEY_DEVICE_ID;
        var deviceId = this.getItem(key, true);
        if (deviceId === undefined) {
            deviceId = uuid.v4();
            this.setItem(key, deviceId, true);
        }

        return deviceId;
    };

    StorageManager.KEY_DEVICE_ID = "deviceId";

    return StorageManager;
}(laya.events.EventDispatcher));