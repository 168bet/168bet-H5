
var CryptoJS = require('crypto-js');
var SignUtils = module.exports = {};

SignUtils.encodeParams = function(params, exclude) {
    var keys = [];
    for (var key in params) {
        if (!params.hasOwnProperty(key)) {
            continue;
        }
        if (key == exclude) {
            continue;
        }

        keys.push(key);
    }

    keys.sort();

    var url = '';
    for (var i = 0, size = keys.length; i < size; i++) {
        var key = keys[i];
        url += (key + '=' + encodeURIComponent(params[key]));
        url += '&';
    }

    return url.substring(0, url.length - 1);
};

SignUtils.userSignature = function(appKey, params) {
    var keys = [];
    for(var key in params) {
        if (key == 'signature') {
            continue;
        }

        keys.push(key);
    }

    keys.sort();

    var url = '';
    for (var i in keys) {
        var key = keys[i];
        url += key + '=' + encodeURIComponent(params[key]);
        if (i < keys.length - 1)
        {
            url += '&';
        }
    }

    url = CryptoJS.HmacSHA1(url, appKey + 'narwhale&');
    return CryptoJS.enc.Base64.stringify(url);
};

SignUtils.serverSignature = function(appSecret, params) {
    var keys = [];
    for(var key in params) {
        if (key == 'signature') {
            continue;
        }

        keys.push(key);
    }

    keys.sort();

    var url = '';
    for (var i in keys) {
        var key = keys[i];
        url += key + '=' + encodeURIComponent(params[key]);
        if (i < keys.length - 1)
        {
            url += '&';
        }
    }

    url = CryptoJS.HmacSHA1(url, appSecret + 'narwhale&');
    return CryptoJS.enc.Base64.stringify(url);
};

SignUtils.formatURL = function(uri, params) {
    var url = uri.length ? uri + '?' : "";

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            url += key + '=' + encodeURIComponent(params[key]) + '&';
        }
    }

    url = url.substring(0, url.length-1);

    return url;
};

