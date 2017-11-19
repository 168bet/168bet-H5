var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var BattleViewUI=(function(_super){
		function BattleViewUI(){
			
		    this.bg_backGround=null;
		    this.boxBottom=null;
		    this.changeBetBtn=null;
		    this.clearBtn=null;
		    this.rebetBtn=null;
		    this.betLight=null;
		    this.boxBottomIdle=null;
		    this.boxTop=null;
		    this.winImage=null;
		    this.lobbyBtn=null;
		    this.setBtn=null;
		    this.goldAddBtn=null;
		    this.boxResultView=null;
		    this.resultBg1=null;
		    this.resultBg2=null;
		    this.resultBg3=null;
		    this.resultBg4=null;
		    this.resultBg5=null;
		    this.resultBg6=null;
		    this.resultBg7=null;
		    this.resultBg8=null;
		    this.resultBg9=null;
		    this.resultBg10=null;
		    this.resultBg11=null;
		    this.resultBg12=null;
		    this.resultBg13=null;
		    this.resultBg14=null;
		    this.resultBg15=null;
		    this.resultBg16=null;
		    this.boxCountDown=null;
		    this.runNowBtn=null;
		    this.maskBg=null;
		    this.circleBg8=null;
		    this.circleBg7=null;
		    this.circleBg6=null;
		    this.circleBg5=null;
		    this.circleBg4=null;
		    this.circleBg3=null;
		    this.circleBg2=null;
		    this.circleBg1=null;
		    this.betBg1=null;
		    this.betBg2=null;
		    this.betBg7=null;
		    this.betBg6=null;
		    this.betBg5=null;
		    this.betBg4=null;
		    this.betBg3=null;
		    this.betBg8=null;
		    this.bet8=null;
		    this.bet3=null;
		    this.bet4=null;
		    this.bet5=null;
		    this.bet6=null;
		    this.bet7=null;
		    this.bet2=null;
		    this.bet1=null;
		    this.fishBetBg8=null;
		    this.fishBetBg7=null;
		    this.fishBetBg6=null;
		    this.fishBetBg5=null;
		    this.fishBetBg4=null;
		    this.fishBetBg3=null;
		    this.fishBetBg2=null;
		    this.fishBetBg1=null;
		    this.fishBet8=null;
		    this.fishBet7=null;
		    this.fishBet6=null;
		    this.fishBet5=null;
		    this.fishBet4=null;
		    this.fishBet3=null;
		    this.fishBet2=null;
		    this.fishBet1=null;
		    this.winReward=null;
		    this.goldLab=null;
		    this.betCount=null;

			BattleViewUI.__super.call(this);
		}

		CLASS$(BattleViewUI,'ui.BattleViewUI',_super);
		var __proto__=BattleViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(BattleViewUI.uiView);
		}

		STATICATTR$(BattleViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1440,"skin":"assets/ui.common/rebet.png","height":900},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"bg_backGround","skin":"assets/ui.bg/bg1.jpg"}},{"type":"Box","props":{"y":834,"x":714,"width":1440,"var":"boxBottom","height":140,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-54,"x":6,"skin":"assets/ui.common/lowBg2.png"}},{"type":"Image","props":{"y":65,"x":1289,"skin":"assets/ui.common/bg1.png"}},{"type":"Button","props":{"y":-36,"x":1282,"var":"changeBetBtn","stateNum":"2","skin":"assets/ui.common/btn_Betting.png"},"child":[{"type":"Image","props":{"y":26,"x":38.99999999999977,"skin":"assets/ui.common/img_Betting.png"}}]},{"type":"Button","props":{"y":-89,"x":176,"var":"clearBtn","stateNum":"2","skin":"assets/ui.common/btnBg4.png"},"child":[{"type":"Image","props":{"y":14,"x":28,"skin":"assets/ui.common/clear.png"}}]},{"type":"Button","props":{"y":-88,"x":20,"var":"rebetBtn","stateNum":"2","skin":"assets/ui.common/btnBg4.png"},"child":[{"type":"Image","props":{"y":16,"x":18,"skin":"assets/ui.common/img_ALL+1.png"}}]},{"type":"Image","props":{"y":94,"x":1357,"var":"betLight","skin":"assets/ui.common/light1.png","anchorY":0.5,"anchorX":0.5}}]},{"type":"Box","props":{"y":833,"x":704,"width":1080,"var":"boxBottomIdle","height":140,"anchorY":0.5,"anchorX":0.5}},{"type":"Box","props":{"y":-1,"x":3,"width":1440,"var":"boxTop","height":106},"child":[{"type":"Image","props":{"skin":"assets/ui.common/upBg.png"}},{"type":"Image","props":{"y":23,"x":45,"skin":"assets/ui.common/goldExp.png"}},{"type":"Image","props":{"y":17,"x":27,"skin":"assets/ui.common/gold.png"}},{"type":"Image","props":{"y":134,"x":635,"visible":false,"var":"winImage","skin":"assets/ui.common/img_WIN.png","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":16,"x":1031,"visible":false,"var":"lobbyBtn","stateNum":"2","skin":"assets/ui.common/btnBg3.png"}},{"type":"Image","props":{"y":33,"x":1089,"visible":false,"skin":"assets/ui.common/lobby.png"}},{"type":"Button","props":{"y":11,"x":1321,"visible":false,"var":"setBtn","stateNum":"2","skin":"assets/ui.common/setBtn.png"}},{"type":"Button","props":{"y":27,"x":341,"visible":false,"var":"goldAddBtn","stateNum":"2","skin":"assets/ui.common/btnBg2.png"}},{"type":"Image","props":{"y":32,"x":349,"visible":false,"skin":"assets/ui.common/add2.png"}}]},{"type":"Box","props":{"y":139,"x":0,"var":"boxResultView","alpha":1},"child":[{"type":"Image","props":{"skin":"assets/ui.common/bg4.png"}},{"type":"Image","props":{"y":55,"x":51,"var":"resultBg1","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":55,"x":149,"var":"resultBg2","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":55,"x":247,"var":"resultBg3","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":55,"x":345,"var":"resultBg4","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":55,"x":443,"var":"resultBg5","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":55,"x":541,"var":"resultBg6","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":55,"x":639,"var":"resultBg7","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":55,"x":737,"var":"resultBg8","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":148,"x":51,"var":"resultBg9","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":148,"x":149,"var":"resultBg10","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":148,"x":247,"var":"resultBg11","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":148,"x":345,"var":"resultBg12","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":148,"x":443,"var":"resultBg13","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":148,"x":536,"var":"resultBg14","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":148,"x":639,"var":"resultBg15","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":148,"x":737,"var":"resultBg16","skin":"assets/ui.common/bg3.png","anchorY":0.5,"anchorX":0.5}}]},{"type":"Box","props":{"y":450,"x":720,"width":250,"var":"boxCountDown","height":200,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":80,"x":125,"skin":"assets/ui.common/bg2.png","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":34,"x":76,"width":100,"valign":"middle","text":"15","name":"countDownLab","height":50,"font":"sky_blue","color":"#ffffff","align":"center"}},{"type":"Button","props":{"y":158,"x":129,"var":"runNowBtn","stateNum":"2","skin":"assets/ui.common/btnBg3.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":20.5,"x":34.499999999999886,"skin":"assets/ui.common/runNow.png"}}]}]},{"type":"Image","props":{"y":749,"x":2,"width":1271,"var":"maskBg","skin":"assets/ui.common/lowBg.png","height":147}},{"type":"Image","props":{"y":839,"x":1193.5,"var":"circleBg8","skin":"assets/ui.common/circleBg1.png","scaleY":1,"scaleX":1,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":839,"x":1034.5,"var":"circleBg7","skin":"assets/ui.common/circleBg1.png","scaleY":1,"scaleX":1,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":839,"x":875.5,"var":"circleBg6","skin":"assets/ui.common/circleBg1.png","scaleY":1,"scaleX":1,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":839,"x":716.5,"var":"circleBg5","skin":"assets/ui.common/circleBg1.png","scaleY":1,"scaleX":1,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":839,"x":557.5,"var":"circleBg4","skin":"assets/ui.common/circleBg1.png","scaleY":1,"scaleX":1,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":839,"x":398.5,"var":"circleBg3","skin":"assets/ui.common/circleBg1.png","scaleY":1,"scaleX":1,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":839,"x":240,"var":"circleBg2","skin":"assets/ui.common/circleBg1.png","scaleY":1,"scaleX":1,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":839,"x":81,"var":"circleBg1","skin":"assets/ui.common/circleBg1.png","scaleY":1,"scaleX":1,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":885,"x":82,"var":"betBg1","skin":"assets/ui.common/bg5.png","scaleY":1,"scaleX":1,"anchorY":1,"anchorX":0.5}},{"type":"Image","props":{"y":885,"x":240,"var":"betBg2","skin":"assets/ui.common/bg5.png","anchorY":1,"anchorX":0.5}},{"type":"Image","props":{"y":885,"x":1035.5,"var":"betBg7","skin":"assets/ui.common/bg5.png","anchorY":1,"anchorX":0.5}},{"type":"Image","props":{"y":885,"x":876.5,"var":"betBg6","skin":"assets/ui.common/bg5.png","anchorY":1,"anchorX":0.5}},{"type":"Image","props":{"y":885,"x":717.5,"var":"betBg5","skin":"assets/ui.common/bg5.png","anchorY":1,"anchorX":0.5}},{"type":"Image","props":{"y":885,"x":558.5,"width":78,"var":"betBg4","skin":"assets/ui.common/bg5.png","height":22,"anchorY":1,"anchorX":0.5}},{"type":"Image","props":{"y":885,"x":399.5,"var":"betBg3","skin":"assets/ui.common/bg5.png","anchorY":1,"anchorX":0.5}},{"type":"Image","props":{"y":885,"x":1194.5,"var":"betBg8","skin":"assets/ui.common/bg5.png","anchorY":1,"anchorX":0.5}},{"type":"Label","props":{"y":884,"x":1194.5,"width":50,"var":"bet8","valign":"middle","text":"A12","name":"bet8","height":20,"font":"white","color":"#ffffff","anchorY":1,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":884,"x":400.5,"width":50,"var":"bet3","valign":"middle","text":"A12","name":"bet3","height":20,"font":"white","color":"#ffffff","anchorY":1,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":884,"x":557.5,"width":50,"var":"bet4","valign":"middle","text":"A12","name":"bet4","height":20,"font":"white","color":"#ffffff","anchorY":1,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":884,"x":716.5,"width":50,"var":"bet5","valign":"middle","text":"A12","name":"bet5","height":20,"font":"white","color":"#ffffff","anchorY":1,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":884,"x":876.5,"width":50,"var":"bet6","valign":"middle","text":"A12","name":"bet6","height":20,"font":"white","color":"#ffffff","anchorY":1,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":884,"x":1035.5,"width":50,"var":"bet7","valign":"middle","text":"A12","name":"bet7","height":20,"font":"white","color":"#ffffff","anchorY":1,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":884,"x":241,"width":50,"var":"bet2","valign":"middle","text":"A12","name":"bet2","height":20,"font":"white","color":"#ffffff","anchorY":1,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":884,"x":82,"width":50,"var":"bet1","valign":"middle","text":"A12","name":"bet1","height":20,"font":"white","color":"#ffffff","anchorY":1,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"y":756,"x":1140.5,"var":"fishBetBg8","skin":"assets/ui.common/bg6.png","scaleY":0.6,"scaleX":0.8}},{"type":"Image","props":{"y":756,"x":982.5,"var":"fishBetBg7","skin":"assets/ui.common/bg6.png","scaleY":0.6,"scaleX":0.8}},{"type":"Image","props":{"y":756,"x":821.5,"var":"fishBetBg6","skin":"assets/ui.common/bg6.png","scaleY":0.6,"scaleX":0.8}},{"type":"Image","props":{"y":756,"x":664.5,"var":"fishBetBg5","skin":"assets/ui.common/bg6.png","scaleY":0.6,"scaleX":0.8}},{"type":"Image","props":{"y":756,"x":506.5,"var":"fishBetBg4","skin":"assets/ui.common/bg6.png","scaleY":0.6,"scaleX":0.8}},{"type":"Image","props":{"y":756,"x":347.5,"var":"fishBetBg3","skin":"assets/ui.common/bg6.png","scaleY":0.6,"scaleX":0.8}},{"type":"Image","props":{"y":757,"x":187,"var":"fishBetBg2","skin":"assets/ui.common/bg6.png","scaleY":0.6,"scaleX":0.8}},{"type":"Image","props":{"y":757,"x":30,"var":"fishBetBg1","skin":"assets/ui.common/bg6.png","scaleY":0.6,"scaleX":0.8}},{"type":"Label","props":{"y":769,"x":1192.5,"width":70,"var":"fishBet8","valign":"middle","text":"9999","scaleY":1.2,"scaleX":1.2,"name":"fishBet8","font":"white","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":769,"x":1034.5,"width":70,"var":"fishBet7","valign":"middle","text":"9999","scaleY":1.2,"scaleX":1.2,"name":"fishBet7","font":"white","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":769,"x":873.5,"width":70,"var":"fishBet6","valign":"middle","text":"9999","scaleY":1.2,"scaleX":1.2,"name":"fishBet6","font":"white","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":769,"x":716.5,"width":70,"var":"fishBet5","valign":"middle","text":"9999","scaleY":1.2,"scaleX":1.2,"name":"fishBet5","font":"white","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":770,"x":559.5,"width":70,"var":"fishBet4","valign":"middle","text":"9999","scaleY":1.2,"scaleX":1.2,"name":"fishBet4","font":"white","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":769,"x":399.5,"width":70,"var":"fishBet3","valign":"middle","text":"9999","scaleY":1.2,"scaleX":1.2,"name":"fishBet3","font":"white","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":770,"x":239,"width":70,"var":"fishBet2","valign":"middle","text":"9999","scaleY":1.2,"scaleX":1.2,"name":"fishBet2","font":"white","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":770,"x":82,"width":70,"var":"fishBet1","valign":"middle","text":"9999","scaleY":1.2,"scaleX":1.2,"name":"fishBet1","font":"white","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":132,"x":775,"width":200,"visible":false,"var":"winReward","valign":"middle","text":"0","scaleY":1,"scaleX":1,"name":"winReward","height":60,"fontSize":40,"font":"orange_yellow","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":49,"x":240,"width":250,"var":"goldLab","valign":"middle","text":"999999991","name":"goldLab","height":60,"fontSize":40,"font":"black_white","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":859,"x":1352,"width":70,"var":"betCount","valign":"middle","text":"9999","scaleY":1.7,"scaleX":1.7,"name":"betCount","font":"white","anchorY":0.5,"anchorX":0.5,"align":"center"}}]};}
		]);
		return BattleViewUI;
	})(View);
var LoaderViewUI=(function(_super){
		function LoaderViewUI(){
			
		    this.progress=null;
		    this.imageFish=null;
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
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1440,"height":900},"child":[{"type":"Image","props":{"width":1440,"skin":"assets/ui.Loader/loaderBg.jpg","sizeGrid":"28,9,5,9","height":900}},{"type":"Image","props":{"y":749,"x":389,"skin":"assets/ui.Loader/progressBg.png"}},{"type":"ProgressBar","props":{"y":760,"x":400,"var":"progress","value":0.1,"skin":"assets/ui.Loader/progress.png"},"child":[{"type":"Image","props":{"y":-15,"x":0,"var":"imageFish","skin":"assets/ui.Loader/loaderFish.png"}}]},{"type":"Label","props":{"y":766,"x":1167,"width":200,"var":"percent","valign":"middle","text":"100A","height":40,"fontSize":38,"font":"white_loader","color":"#000000","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":710,"x":738,"width":500,"var":"message","valign":"middle","text":"加载中...","height":80,"fontSize":50,"font":"Microsoft YaHei","color":"#ffffff","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}}]};}
		]);
		return LoaderViewUI;
	})(View);
var massageViewUI=(function(_super){
		function massageViewUI(){
			
		    this.viewBox=null;
		    this.fishName2=null;
		    this.fishName1=null;
		    this.rewardLabel2=null;
		    this.rewardLabel1=null;

			massageViewUI.__super.call(this);
		}

		CLASS$(massageViewUI,'ui.massageViewUI',_super);
		var __proto__=massageViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(massageViewUI.uiView);
		}

		STATICATTR$(massageViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1440,"height":900},"child":[{"type":"Box","props":{"y":450,"x":720,"width":1440,"var":"viewBox","scaleY":1,"scaleX":1,"pivotY":450,"pivotX":720,"height":900},"child":[{"type":"Image","props":{"y":450,"x":720,"skin":"assets/ui.common/infoBg.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":450,"x":546,"var":"fishName2","skin":"assets/ui.common/title_1001.png","rotation":-90,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":450,"x":896,"var":"fishName1","skin":"assets/ui.common/title_1001.png","rotation":90,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":629,"x":695,"var":"rewardLabel2","text":"A30","scaleY":-1,"scaleX":-1,"font":"yellow","anchorY":0.5}},{"type":"Label","props":{"y":273,"x":743,"var":"rewardLabel1","text":"A30","font":"yellow","anchorY":0.5}},{"type":"Image","props":{"y":251,"x":609,"skin":"assets/ui.common/win.png"}},{"type":"Image","props":{"y":648,"x":822,"skin":"assets/ui.common/win.png","scaleY":-1,"scaleX":-1}}]}]};}
		]);
		return massageViewUI;
	})(View);