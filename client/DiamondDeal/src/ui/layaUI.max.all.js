var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var BattleViewUI=(function(_super){
		function BattleViewUI(){
			
		    this.topLightBg=null;
		    this.blockBox=null;
		    this.touchView=null;
		    this.winBox=null;
		    this.winBg3=null;
		    this.imgYouWon=null;
		    this.endReward=null;
		    this.cashOutBox=null;
		    this.cashOutBtn=null;
		    this.quickPickBox=null;
		    this.quickPickBtn=null;
		    this.nextWinReward=null;
		    this.totalReward=null;
		    this.winReward=null;
		    this.diamondLeft=null;
		    this.life4=null;
		    this.life3=null;
		    this.life2=null;
		    this.life1=null;
		    this.account=null;
		    this.img_unlucky=null;

			BattleViewUI.__super.call(this);
		}

		CLASS$(BattleViewUI,'ui.BattleViewUI',_super);
		var __proto__=BattleViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(BattleViewUI.uiView);
		}

		STATICATTR$(BattleViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1440,"skin":"assets/common/bg.png","height":900},"child":[{"type":"Image","props":{"width":1440,"skin":"assets/ui.common/bg_0001.png","sizeGrid":"32,8,12,4","height":900}},{"type":"Image","props":{"y":220,"x":720,"skin":"assets/ui.common/bg_0003.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":60,"x":720,"skin":"assets/ui.common/img_0007.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":108,"x":720,"skin":"assets/ui.common/img_0001.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":103,"x":720,"visible":false,"var":"topLightBg","skin":"assets/ui.common/ani_chd.png","anchorY":0.5,"anchorX":0.5}},{"type":"Box","props":{"width":1440,"var":"blockBox","height":900},"child":[{"type":"Image","props":{"y":438,"x":720,"skin":"assets/ui.common/bg_0002.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":216,"x":230,"var":"touchView","skin":"assets/ui.common/img_0003.png"}}]},{"type":"Box","props":{"y":0,"x":0,"width":1440,"var":"winBox","height":900},"child":[{"type":"Image","props":{"y":176,"x":151.99999999999997,"var":"winBg3","skin":"assets/ui.common/ani_xx.png"}},{"type":"Image","props":{"y":213.99999999999994,"x":336.00000000000006,"var":"imgYouWon","skin":"assets/ui.common/img_youwon.png"}},{"type":"Label","props":{"y":457,"x":720,"width":950,"var":"endReward","valign":"middle","text":"80000","name":"endReward","height":150,"fontSize":80,"color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Image","props":{"y":732,"x":545,"var":"cashOutBox","skin":"assets/ui.common/img_0012_l.png"},"child":[{"type":"Button","props":{"y":96,"x":175,"var":"cashOutBtn","stateNum":"2","skin":"assets/ui.common/btn_0002.png","labelSize":40,"labelFont":"Microsoft YaHei","labelColors":"#ffffff","labelBold":true,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":38.000000000000114,"x":70.99999999999989,"skin":"assets/ui.common/img_0011.png"}}]},{"type":"Image","props":{"y":762.9999999999998,"x":961.9999999999998,"var":"quickPickBox","skin":"assets/ui.common/img_0013_s.png"},"child":[{"type":"Button","props":{"y":7.000000000000227,"x":14.000000000000114,"var":"quickPickBtn","stateNum":"2","skin":"assets/ui.common/btn_0003.png","name":"quickPickBtn"}},{"type":"Image","props":{"y":37.00000000000023,"x":45.00000000000023,"skin":"assets/ui.common/img_0010.png"}}]},{"type":"Label","props":{"y":108,"x":720,"width":200,"var":"nextWinReward","valign":"middle","text":"1","name":"nextWinReward","height":50,"fontSize":40,"color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":163,"x":838,"width":150,"var":"totalReward","valign":"middle","text":"100000","name":"totalReward","height":50,"fontSize":20,"color":"#ffffff","bold":true,"anchorY":0.5,"anchorX":0,"align":"left"}},{"type":"Label","props":{"y":841,"x":720,"width":200,"var":"winReward","text":"1.56","name":"winReward","height":60,"fontSize":40,"font":"Microsoft YaHei","color":"#ffffff","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"y":147,"x":565,"skin":"assets/ui.common/img_0008.png"}},{"type":"Image","props":{"y":86,"x":1052,"skin":"assets/ui.common/img_0005.png"}},{"type":"Label","props":{"y":146,"x":562,"width":100,"var":"diamondLeft","valign":"middle","text":"10","name":"diamondLeft","height":30,"fontSize":20,"color":"#ffffff","anchorX":1,"align":"right"}},{"type":"Image","props":{"y":24,"x":19,"skin":"assets/ui.common/logo.png"}},{"type":"Image","props":{"y":23,"x":1083,"skin":"assets/ui.common/img_0009.png"}},{"type":"Image","props":{"y":2,"x":1062,"skin":"assets/ui.common/icon_0001.png"}},{"type":"Image","props":{"y":155,"x":1192,"var":"life4","skin":"assets/ui.common/img_0006.png"}},{"type":"Image","props":{"y":156,"x":1143,"var":"life3","skin":"assets/ui.common/img_0006.png"}},{"type":"Image","props":{"y":155,"x":1094,"var":"life2","skin":"assets/ui.common/img_0006.png"}},{"type":"Image","props":{"y":155,"x":1044,"var":"life1","skin":"assets/ui.common/img_0006.png"}},{"type":"Label","props":{"y":47,"x":1268,"width":250,"var":"account","valign":"middle","text":"99999","name":"account","height":40,"fontSize":30,"color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"y":439,"x":720,"var":"img_unlucky","skin":"assets/ui.common/img_unlucky.png","anchorY":0.5,"anchorX":0.5}}]};}
		]);
		return BattleViewUI;
	})(View);
var BetViewUI=(function(_super){
		function BetViewUI(){
			
		    this.upBet=null;
		    this.downBet=null;
		    this.currentBet=null;
		    this.startBtn=null;
		    this.tenDiamondReward=null;

			BetViewUI.__super.call(this);
		}

		CLASS$(BetViewUI,'ui.BetViewUI',_super);
		var __proto__=BetViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(BetViewUI.uiView);
		}

		STATICATTR$(BetViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1440,"height":900},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"assets/ui.common/bg.png"}},{"type":"Image","props":{"y":450,"x":720,"skin":"assets/ui.common/img_0020.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":343,"x":540.0000000000001,"skin":"assets/ui.common/img_0021.png"}},{"type":"Button","props":{"y":344,"x":811,"var":"upBet","stateNum":"2","skin":"assets/ui.common/btn_0004.png"},"child":[{"type":"Image","props":{"y":11,"x":20,"skin":"assets/ui.common/img_0014.png"}}]},{"type":"Button","props":{"y":414,"x":811,"var":"downBet","stateNum":"2","skin":"assets/ui.common/btn_0004.png"},"child":[{"type":"Image","props":{"y":14,"x":21,"skin":"assets/ui.common/img_0015.png"}}]},{"type":"Label","props":{"y":425,"x":673,"width":100,"var":"currentBet","valign":"middle","text":"1","name":"currentBet","height":60,"fontSize":40,"font":"Microsoft YaHei","color":"#ffef3e","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Button","props":{"y":554,"x":720,"var":"startBtn","stateNum":"2","skin":"assets/ui.common/btn_0005.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":29,"x":24,"skin":"assets/ui.common/img_START.png"}}]},{"type":"Image","props":{"y":343,"x":542,"skin":"assets/ui.common/img_0018.png"}},{"type":"Image","props":{"y":347,"x":591,"skin":"assets/ui.common/img_Your-bet.png"}},{"type":"Image","props":{"y":250,"x":720,"visible":false,"skin":"assets/ui.common/img_make a bet.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":293,"x":966,"skin":"assets/ui.common/img_0017.png"}},{"type":"Image","props":{"y":293,"x":224,"skin":"assets/ui.common/img_0017.png"}},{"type":"Image","props":{"y":661,"x":453,"skin":"assets/ui.common/img_0016.png"}},{"type":"Image","props":{"y":306,"x":1030,"skin":"assets/ui.common/img_Press.png"}},{"type":"Image","props":{"y":351,"x":984,"skin":"assets/ui.common/icon_0003.png"}},{"type":"Image","props":{"y":483,"x":1006,"skin":"assets/ui.common/img_Any-time.png"}},{"type":"Image","props":{"y":308,"x":322,"skin":"assets/ui.common/img_10.png"}},{"type":"Image","props":{"y":364,"x":303,"skin":"assets/ui.common/icom_0001.png"}},{"type":"Image","props":{"y":449,"x":288,"skin":"assets/ui.common/img_hidden.png"}},{"type":"Image","props":{"y":484,"x":259,"skin":"assets/ui.common/img_diamands.png"}},{"type":"Image","props":{"y":695,"x":720,"skin":"assets/ui.common/img_REWARD.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":755,"x":720,"skin":"assets/ui.common/img_0019.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":310,"x":720,"skin":"assets/ui.common/img_Win-rate_1-in-1.66.png","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":744,"x":720,"width":330,"var":"tenDiamondReward","valign":"middle","text":"100,000","name":"tenDiamondReward","height":50,"fontSize":40,"font":"Microsoft YaHei","color":"#ffef3e","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}}]};}
		]);
		return BetViewUI;
	})(View);
var LoaderViewUI=(function(_super){
		function LoaderViewUI(){
			
		    this.progress=null;
		    this.percent=null;
		    this.message=null;

			LoaderViewUI.__super.call(this);
		}

		CLASS$(LoaderViewUI,'ui.LoaderViewUI',_super);
		var __proto__=LoaderViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(LoaderViewUI.uiView);
		}

		STATICATTR$(LoaderViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1440,"height":900},"child":[{"type":"Box","props":{"y":0,"x":0,"width":1440,"height":900},"child":[{"type":"ProgressBar","props":{"y":741,"x":259,"var":"progress","skin":"assets/ui.loader/progress.png"}},{"type":"Label","props":{"y":759,"x":1268,"var":"percent","text":"10%","fontSize":50,"font":"Microsoft YaHei","color":"#ffffff","bold":true,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":700,"x":720,"var":"message","text":"加载中...","fontSize":50,"font":"Microsoft YaHei","color":"#ffffff","bold":true,"anchorY":0.5,"anchorX":0.5}}]}]};}
		]);
		return LoaderViewUI;
	})(View);