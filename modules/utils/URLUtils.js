/*
 * JavaScript URLUtils Library
 * 
 * The MIT License
 * 
 * Copyright (c) 2012 James Allardice
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var URLUtils = {
    getParam: function(name) {
        var regex = new RegExp("[?&]" + name + "=([^&#]*)"),
            results = regex.exec(window.location.href);
        if(results) {
            return decodeURIComponent(results[1]);
        }
        return false;
    },
    getParams: function() {
    	var regex = /[?&]([^=#]+)=([^&#]*)/g,
    	    url = window.location.href,
    	    params = {},
    	    match;
    	while(match = regex.exec(url)) {
    	    params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);    
        }
        return params;
    },
    getHash: function() {
        return window.location.hash.substring(1);
    },
    makeSlug: function(str) {
        return str.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
    },
    makeQueryString: function(obj, includeUndefined) {
        var qs = [],
            str,
            val,
            type;
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                val = obj[prop];
                type = Object.prototype.toString.call(val);
                qs.push(
                    type === "[object Object]" ?
                        URLUtils.makeQueryString(val) :
                        type !== "[object Undefined]" || includeUndefined ?
                            encodeURIComponent(prop) + "=" + encodeURIComponent(val) :
                            encodeURIComponent(prop) + "="
                );
            }
        }
        return qs.join("&");
    }
};