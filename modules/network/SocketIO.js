
var SocketIO = (function(_super) {
    function SocketIO() {
        SocketIO.super(this);

        this.url = null;
        this.socket = null;
    }

    Laya.class(SocketIO, "SocketIO", _super);

    SocketIO.prototype.connect = function(url) {
        if (this.socket != null) {
            this.socket.close();
        }

        var socket = io(url);

        socket.on("connect", this.onConnect.bind(this));
        socket.on("message", this.onMessage.bind(this));
        socket.on("disconnect", this.onDisconnect.bind(this));
        socket.on("error", this.onError.bind(this));
        socket.on("close", this.onClose.bind(this));
        socket.on("connect_error", function() {console.log("connect_error")});

        this.socket = socket;
        this.url = url;
    };

    SocketIO.prototype.onConnect = function() {
        this.event(SocketIO.CONNECTED);
    };

    SocketIO.prototype.onDisconnect = function() {
        this.event(SocketIO.DICONNECTED);
    };

    SocketIO.prototype.onMessage = function(data) {
        this.event(SocketIO.MESSAGE, data);
    };

    SocketIO.prototype.onError = function() {
        this.event(SocketIO.ERROR);
    };

    SocketIO.prototype.onClose = function() {
        this.event(SocketIO.CLOSED);
    };

    SocketIO.prototype.send = function(msg) {
        this.socket.emit("message", msg);
    };

    SocketIO.CONNECTED = "socket.io.connected";
    SocketIO.DICONNECTED = "socket.io.disconnected";
    SocketIO.ERROR = "socket.io.error";
    SocketIO.CLOSED = "socket.io.closed";
    SocketIO.MESSAGE = "socket.io.message";

    return SocketIO;
}(laya.events.EventDispatcher));