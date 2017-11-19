var UILAYERORDER = 50;          //UI层       
var UIManager = (function(_super) {
    function UIManager() {
        UIManager.super(this);
        this.allRotaryFruits = null;
        this.rotaryFruitBoxList = null;
        this.glowFruitList = [];
    }

    Laya.class(UIManager, "UIManager", _super);

    UIManager.prototype.init = function(callback) {
        this._uiLayers = [];      //记录创建在UI层的节点
        callback && callback();
    };

    UIManager.prototype.showMessage = function(msg) {
        var boxMessage = new BoxMessage(msg);

        var onBackOut = function() {
            Laya.stage.removeChild(boxMessage);
            boxMessage.destroy();
        };
        var onBackIn = function() {
            Laya.Tween.to(
                boxMessage,
                {x: Laya.stage.width + boxMessage.width},
                300,
                Laya.Ease["backOut"],
                Laya.Handler.create(null, onBackOut),
                1000,
                false
            );
        };

        Laya.Tween.from(
            boxMessage,
            {x: 0},
            500,
            Laya.Ease["backIn"],
            Laya.Handler.create(null, onBackIn)
        );
        Laya.stage.addChild(boxMessage);
    };

    UIManager.prototype.removeUiLayer = function(layer){
        var index = this._uiLayers.indexOf(layer);
        if(index == -1){
            return;
        }
        this._uiLayers.splice(index, 1);
        if(layer.dispose){
            layer.dispose();
        }
    };

    //让界面添加颜色屏蔽层(Dialog)
    UIManager.prototype.addShieldLayerDialog = function(layer,alpha,isDispose){
        isDispose = isDispose || false;
        alpha = alpha || 0.3;
        //屏蔽层
        var shieldLayer = new Laya.Sprite();
        shieldLayer.alpha = alpha;
        shieldLayer.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
        layer.addChild(shieldLayer);
        var layerPos = layer.localToGlobal(Point.p(0,0));
        shieldLayer.x = -layerPos.x;
        shieldLayer.y = -layerPos.y;

        var hitArea = new Laya.HitArea();
        hitArea.hit.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
        shieldLayer.hitArea = hitArea;
        shieldLayer.mouseEnabled = true;
        shieldLayer.zOrder = -100;

        if(isDispose){
            var dispose = function(){
                layer.close();
            };
            shieldLayer.on(Laya.Event.CLICK, this, dispose);
        }

        return shieldLayer;
    };

    UIManager.prototype.addUiLayer = function(layer,addShieldObj){
        layer.zOrder = UILAYERORDER;
        this._uiLayers.push(layer);

        if(layer.show){
            //Dialog
            layer.show();
            Laya.stage.addChild(layer);

            if(addShieldObj){
                if(addShieldObj.isAddShield !== undefined){
                    var alpha = addShieldObj.alpha;
                    var isDispose = addShieldObj.isDispose;
                    this.addShieldLayerDialog(layer,alpha,isDispose)
                }
                else{
                    this.addShieldLayerDialog(layer)
                }
            }
        }
        else{
            //View
            Laya.stage.addChild(layer);

            if(addShieldObj){
                if(addShieldObj.isAddShield !== undefined){
                    var alpha = addShieldObj.alpha;
                    var isDispose = addShieldObj.isDispose;
                    this.addShieldLayerView(layer,alpha,isDispose)
                }
                else{
                    this.addShieldLayerView(layer)
                }
            }
        }
    };

    UIManager.prototype.setAllRotaryFruits = function (allFruitList) {
        this.allRotaryFruits = allFruitList;
    };

    UIManager.prototype.getAllRotaryFruits = function () {
        return this.allRotaryFruits;
    };

    UIManager.prototype.setRotaryFruitBoxList = function (boxList) {
        this.rotaryFruitBoxList = boxList;
    };

    UIManager.prototype.saveGlowFruitIndex = function (index) {
        if (typeof (index) != "number") {
            return;
        }

        if (this.glowFruitList.indexOf(index) == -1) {
            this.glowFruitList.push(index);
        }
    };

    UIManager.prototype.cleanSaveGlowFruitList = function () {
        this.glowFruitList = [];
        var lightFruit = this.rotaryFruitBoxList;
        for (var index in lightFruit) {
            lightFruit[index].setFruitGray();
        }
    };

    UIManager.prototype.getFruitCellGraySkin = function (type) {
        var skinPath = "";
        switch (type) {
            case "golden": {
                skinPath = UIManager.CELL_GRAY_IMG.GOLDEN;
                break;
            }
            case "blue": {
                skinPath = UIManager.CELL_GRAY_IMG.BLUE;
                break;
            }
            case "deep": {
                skinPath = UIManager.CELL_GRAY_IMG.DEEP;
                break;
            }
            case "shallow": {
                skinPath = UIManager.CELL_GRAY_IMG.SHALLOW;
                break;
            }
            default: {
                break;
            }
        }
        return skinPath;
    };

    UIManager.prototype.setFruitGlowByIndex = function (index) {
        if (typeof (index) == "number"){
            var lightFruit = this.rotaryFruitBoxList[index];
            if (lightFruit) {
                lightFruit.setFruitLighting();
            }
        }
    };

    UIManager.prototype.setFruitUnGlowByIndex = function (index) {
        if (typeof (index) == "number"){
            var lightFruit = this.rotaryFruitBoxList[index];
            if (lightFruit && this.glowFruitList.indexOf(index) == -1) {
                lightFruit.setFruitGray();
            }
        }
    };

    UIManager.prototype.getBigFruitIconPath = function (fruitName) {
        if (fruitName == null) {
            return;
        }

        return UIManager.ICON_BIG[fruitName];
    };

    UIManager.prototype.getMiddleFruitIconPath = function (fruitName) {
        if (fruitName == null) {
            return;
        }

        return UIManager.ICON_MEDDLE[fruitName];
    };

    UIManager.prototype.getMiddleGlowFruitIconPath = function (fruitName) {
        if (fruitName == null) {
            return;
        }

        return UIManager.ICON_MEDDLE_GLOW[fruitName];
    };

    UIManager.prototype.getBigGlowFruitIconPath = function (fruitName) {
        if (fruitName == null) {
            return;
        }

        return UIManager.ICON_BIG_GLOW[fruitName];
    };

    UIManager.prototype.getMiddleFruitGrayPath = function (fruitName) {
        if (fruitName == null) {
            return;
        }

        return UIManager.MIDDLE_FRUIT_GRAY_IMG[fruitName];
    };

    UIManager.prototype.getBigFruitGrayPath = function (fruitName) {
        if (fruitName == null) {
            return;
        }

        return UIManager.BIG_FRUIT_GRAY_IMG[fruitName];
    };

    UIManager.BIG_FRUIT_GRAY_IMG = {
        "GG": "assets/ui.main/img_0036.png",
        "77": "assets/ui.main/img_0034.png",
        "Star": "assets/ui.main/img_0042.png",
        "Watermelon": "assets/ui.main/img_0032.png",
        "Bell": "assets/ui.main/img_0040.png",
        "Pomelo": "assets/ui.main/img_0030.png",
        "Orange": "assets/ui.main/img_0044.png",
        "Apple": "assets/ui.main/img_0038.png",
        "BlueLuck": "assets/ui.main/img_0046.png",
        "GoldenLuck": "assets/ui.main/img_0045.png"
    };

    UIManager.MIDDLE_FRUIT_GRAY_IMG = {
        "GG": "assets/ui.main/img_0035.png",
        "77": "assets/ui.main/img_0033.png",
        "Star": "assets/ui.main/img_0041.png",
        "Watermelon": "assets/ui.main/img_0031.png",
        "Bell": "assets/ui.main/img_0039.png",
        "Pomelo": "assets/ui.main/img_0029.png",
        "Orange": "assets/ui.main/img_0043.png",
        "Apple": "assets/ui.main/img_0037.png"
    };

    UIManager.CELL_GRAY_IMG = {
        "GOLDEN": "assets/ui.images/img_0004_mc.png",
        "BLUE": "assets/ui.images/img_0005_mc.png",
        "DEEP": "assets/ui.images/img_0003_mc.png",
        "SHALLOW": "assets/ui.images/img_0002_mc.png"
    };

    UIManager.ICON_BIG = {
        "GG": "assets/ui.main/icon_gg-L.png",
        "77": "assets/ui.main/icon_77-L.png",
        "Star": "assets/ui.main/icon_xx-L.png",
        "Watermelon": "assets/ui.main/icon_xg-L.png",
        "Bell": "assets/ui.main/icon_ld-L.png",
        "Pomelo": "assets/ui.main/icon_yz-l.png",
        "Orange": "assets/ui.main/icon_jz-L.png",
        "Apple": "assets/ui.main/icon_pg-L.png",
        "BlueLuck": "assets/ui.main/icon_LUCK-blue.png",
        "GoldenLuck": "assets/ui.main/icon_LUCK-Golden.png"
    };

    UIManager.ICON_MEDDLE = {
        "GG": "assets/ui.main/icon_gg-s.png",
        "77": "assets/ui.main/icon_77-M.png",
        "Star": "assets/ui.main/icon_xx-M.png",
        "Watermelon": "assets/ui.main/icon_xg-M.png",
        "Bell": "assets/ui.main/icon_ld-M.png",
        "Pomelo": "assets/ui.main/icon_yz-M.png",
        "Orange": "assets/ui.main/icon_jz-M.png",
        "Apple": "assets/ui.main/icon_pg-M.png"
    };

    UIManager.ICON_BIG_GLOW = {
        "GG": "assets/ui.main/icon_0007_gg_gl2.png",
        "77": "assets/ui.main/icon_0005_77_gl2.png",
        "Star": "assets/ui.main/icon_0013_xx_gl2.png",
        "Watermelon": "assets/ui.main/icon_0003_xg_gl2.png",
        "Bell": "assets/ui.main/icon_0011_ld_gl2.png",
        "Pomelo": "assets/ui.main/icon_0001_yz_gl2.png",
        "Orange": "assets/ui.main/icon_0017_jz-gl2.png",
        "Apple": "assets/ui.main/icon_0009_pg_gl2.png",
        "BlueLuck": "assets/ui.main/icon_0014_luck_gl.png",
        "GoldenLuck": "assets/ui.main/icon_0015_luck_gl2.png"
    };

    UIManager.ICON_MEDDLE_GLOW = {
        "GG": "assets/ui.main/icon_0006_gg_gl.png",
        "77": "assets/ui.main/icon_0004_77_gl.png",
        "Star": "assets/ui.main/icon_0012_xx_gl.png",
        "Watermelon": "assets/ui.main/icon_0002_xg_gl.png",
        "Bell": "assets/ui.main/icon_0010_ld_gl.png",
        "Pomelo": "assets/ui.main/icon_0000_yz_gl.png",
        "Orange": "assets/ui.main/icon_0016_jz-gl.png",
        "Apple": "assets/ui.main/icon_0008_pg_gl.png"
    };

    return UIManager;
}(laya.events.EventDispatcher));