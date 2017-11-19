var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var BoxMessageUI=(function(_super){
		function BoxMessageUI(){
			
		    this.textMessage=null;

			BoxMessageUI.__super.call(this);
		}

		CLASS$(BoxMessageUI,'ui.Boxs.BoxMessageUI',_super);
		var __proto__=BoxMessageUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(BoxMessageUI.uiView);
		}

		STATICATTR$(BoxMessageUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":800,"height":200},"child":[{"type":"Image","props":{"width":800,"top":0,"skin":"assets/ui.common/message2.png","sizeGrid":"8,2,5,2","left":0,"height":200}},{"type":"Label","props":{"wordWrap":true,"width":800,"var":"textMessage","valign":"middle","text":"庄家赢了","height":200,"fontSize":80,"font":"Helvetica","color":"#ffffff","bold":true,"align":"center"}}]};}
		]);
		return BoxMessageUI;
	})(View);
var BoxPlayerUI=(function(_super){
		function BoxPlayerUI(){
			
		    this.labelName=null;
		    this.iconPlayer=null;
		    this.labelBetAmount=null;

			BoxPlayerUI.__super.call(this);
		}

		CLASS$(BoxPlayerUI,'ui.Boxs.BoxPlayerUI',_super);
		var __proto__=BoxPlayerUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(BoxPlayerUI.uiView);
		}

		STATICATTR$(BoxPlayerUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":158,"height":245},"child":[{"type":"Image","props":{"y":2,"x":2,"skin":"assets/ui.game/img_bg_1.png"}},{"type":"Image","props":{"y":0,"x":0,"skin":"assets/ui.game/img_bg_2.png"}},{"type":"Label","props":{"y":26,"x":79,"width":125,"var":"labelName","text":"555","height":23,"fontSize":20,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"y":60,"x":14,"skin":"assets/ui.common/img_frame.png","anchorX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"iconPlayer"}}]},{"type":"Image","props":{"y":201,"x":4,"skin":"assets/ui.common/img_bg_4.png"}},{"type":"Label","props":{"y":222,"x":89,"width":125,"var":"labelBetAmount","text":"555","height":23,"fontSize":20,"font":"playerBet","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}}]};}
		]);
		return BoxPlayerUI;
	})(View);
var MessageDialogUI=(function(_super){
		function MessageDialogUI(){
			
		    this.lucky5Bg=null;
		    this.winOrLost=null;
		    this.imageJackPot=null;
		    this.resultScore=null;
		    this.element20=null;
		    this.element17=null;
		    this.element16=null;
		    this.element15=null;
		    this.element26=null;
		    this.element14=null;
		    this.element18=null;
		    this.element19=null;
		    this.element21=null;
		    this.element22=null;
		    this.element23=null;
		    this.element24=null;
		    this.element25=null;
		    this.element3=null;
		    this.element2=null;

			MessageDialogUI.__super.call(this);
		}

		CLASS$(MessageDialogUI,'ui.Dialogs.MessageDialogUI',_super);
		var __proto__=MessageDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(MessageDialogUI.uiView);
		}

		STATICATTR$(MessageDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1440,"height":900,"anchorY":0,"anchorX":0},"child":[{"type":"Image","props":{"y":450,"x":720,"visible":true,"skin":"ui.table/Bg4.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":450,"x":720,"visible":true,"skin":"ui.table/Bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":362,"x":722,"visible":true,"skin":"ui.table/Bg2.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":642,"x":722,"visible":true,"skin":"ui.table/Bg1.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":137,"x":722,"visible":true,"skin":"ui.table/congratulations.png","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":799,"x":887,"visible":true,"stateNum":2,"skin":"ui.table/btn_double2.png","name":"yes","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":17.999999999999886,"x":46.99999999999977,"skin":"ui.table/gamblingSize.png"}}]},{"type":"Button","props":{"y":799,"x":576,"visible":true,"stateNum":2,"skin":"ui.table/btn_back2.png","name":"close","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":17.999999999999886,"x":71.99999999999989,"skin":"ui.table/continue.png"}}]},{"type":"Image","props":{"y":642,"x":726,"visible":true,"skin":"ui.table/blueBg2.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":362,"x":727,"var":"lucky5Bg","skin":"ui.table/element27.png","scaleY":1.3,"scaleX":1.3,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":576,"x":657,"visible":true,"var":"winOrLost","skin":"ui.table/massageView_Win.png"}},{"type":"Image","props":{"y":581,"x":596,"var":"imageJackPot","skin":"ui.table/jackPot2.png"}},{"type":"Label","props":{"y":675,"x":734,"width":400,"visible":true,"var":"resultScore","valign":"middle","text":90000,"fontSize":48,"font":"golden_orange","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"y":177,"x":462,"var":"element20","skin":"ui.table/element20.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element17","skin":"ui.table/element17.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element16","skin":"ui.table/element16.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element15","skin":"ui.table/element15.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element26","skin":"ui.table/element26.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element14","skin":"ui.table/element14.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element18","skin":"ui.table/element18.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element19","skin":"ui.table/element19.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element21","skin":"ui.table/element21.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element22","skin":"ui.table/element22.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element23","skin":"ui.table/element23.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element24","skin":"ui.table/element24.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":178,"x":462,"var":"element25","skin":"ui.table/element25.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":407,"x":851,"width":414,"var":"element3","skin":"ui.table/element3.png","scaleY":1.3,"scaleX":1.3,"pivotY":177.88013318534962,"pivotX":297.11986681465055,"height":290}},{"type":"Image","props":{"y":463,"x":568,"var":"element2","skin":"ui.table/element2.png","scaleY":1.3,"scaleX":1.3,"pivotY":220,"pivotX":75}}]};}
		]);
		return MessageDialogUI;
	})(Dialog);
var GameViewUI=(function(_super){
		function GameViewUI(){
			
		    this.poker1=null;
		    this.poker3=null;
		    this.poker2=null;
		    this.pokerLightNode=null;
		    this.labelTime=null;
		    this.labelJackpot=null;
		    this.boxBottom=null;
		    this.labelBetAmount=null;
		    this.labelPlayerName=null;
		    this.iconPlayer=null;
		    this.btnAdd=null;
		    this.labelBalance=null;
		    this.btnAbandon=null;
		    this.btnBetOn=null;
		    this.boxNum=null;
		    this.labelRoomNum=null;
		    this.labelTip=null;
		    this.boxTop=null;
		    this.boxMiddle=null;

			GameViewUI.__super.call(this);
		}

		CLASS$(GameViewUI,'ui.Views.GameViewUI',_super);
		var __proto__=GameViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(GameViewUI.uiView);
		}

		STATICATTR$(GameViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1440,"skin":"assets/ui.common/img_bg_1.png","sizeGrid":"0,100,0,100","height":900,"font":"room","color":"#ff8226"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"assets/ui.game/bg.png","name":"background"},"child":[{"type":"Image","props":{"y":243,"x":561,"skin":"assets/ui.common/icon_balance_2.png"}},{"type":"Image","props":{"y":256,"x":720,"skin":"assets/ui.common/img_bg_2.png","anchorX":0.5,"alpha":"1"}},{"type":"Image","props":{"y":259,"x":612,"skin":"assets/ui.game/img_pool.png"}},{"type":"Image","props":{"y":440,"x":530,"var":"poker1","skin":"assets/ui.common/poker.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":440,"x":720,"visible":false,"var":"poker3","skin":"assets/ui.common/poker.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":440,"x":910,"var":"poker2","skin":"assets/ui.common/poker.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":311,"x":425,"var":"pokerLightNode"}},{"type":"Image","props":{"y":440,"x":720,"skin":"assets/ui.game/img_round.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":37,"x":2,"width":136,"var":"labelTime","text":"12","height":61,"fontSize":25,"font":"time","color":"#ffffff","align":"center"}}]},{"type":"Label","props":{"y":261,"x":688,"width":136,"var":"labelJackpot","text":"2000","height":28,"fontSize":25,"font":"jackpot","color":"#ffffff","align":"left"}}]},{"type":"Box","props":{"y":818,"x":720,"width":1440,"visible":true,"var":"boxBottom","height":164,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"skin":"assets/ui.game/img_bottom.png","bottom":0}},{"type":"Image","props":{"x":720,"skin":"assets/ui.game/img_bottom_middle.png","bottom":0,"anchorX":0.5},"child":[{"type":"Button","props":{"y":17,"x":40.999999999999886,"stateNum":"1","skin":"assets/ui.game/button_stake.png"}},{"type":"Label","props":{"y":99,"x":53,"width":329,"var":"labelBetAmount","text":"6666666","height":50,"fontSize":40,"font":"bet","color":"#ffffff","align":"center"}}]},{"type":"Image","props":{"y":30,"x":160,"skin":"assets/ui.game/img_title_6.png","sizeGrid":"0,100,0,100"},"child":[{"type":"Label","props":{"y":7,"x":-1,"width":359,"var":"labelPlayerName","text":"超级败家仔","height":48,"fontSize":35,"color":"#ffffff","align":"center"}}]},{"type":"Image","props":{"y":17,"x":14,"skin":"assets/ui.game/img_userIconFrame.png"},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"iconPlayer","skin":"assets/ui.game/img_userIconFrame.png"}}]},{"type":"Image","props":{"y":90,"x":173,"skin":"assets/ui.common/img_bg_1.png"},"child":[{"type":"Image","props":{"y":-6,"x":3,"skin":"assets/ui.common/icon_balance_1.png"}},{"type":"Button","props":{"y":3,"x":258.99999999999994,"var":"btnAdd","stateNum":"2","skin":"assets/ui.common/btn_02.png"},"child":[{"type":"Image","props":{"y":8,"x":7,"skin":"assets/ui.common/img_add.png"}}]},{"type":"Label","props":{"y":14.999999999999886,"x":61,"width":197,"var":"labelBalance","text":"6666666","height":44,"fontSize":30,"font":"balance","color":"#ffffff","align":"center"}}]},{"type":"Button","props":{"y":54,"x":1208,"var":"btnAbandon","stateNum":"2","skin":"assets/ui.common/btn_05.png"},"child":[{"type":"Image","props":{"y":19,"x":36.00000000000023,"skin":"assets/ui.game/img_backTitle.png"}}]},{"type":"Button","props":{"y":54,"x":976,"var":"btnBetOn","stateNum":"2","skin":"assets/ui.common/btn_04.png"},"child":[{"type":"Image","props":{"y":19,"x":32.000000000000114,"skin":"assets/ui.game/img_bet.png"}}]}]},{"type":"Box","props":{"y":57.500000000000014,"x":720,"width":1440,"visible":true,"var":"boxNum","height":63,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":31,"x":685,"skin":"assets/ui.common/img_tipBg.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":9,"x":382,"skin":"assets/ui.common/img_tipBg_1.png"},"child":[{"type":"Label","props":{"y":8.000000000000014,"x":7.000000000000057,"width":82,"var":"labelRoomNum","text":"026","height":48,"fontSize":40,"font":"room","color":"#ffffff","align":"center"}}]},{"type":"Label","props":{"y":12.99999999999995,"x":483,"width":594,"var":"labelTip","text":"你退出时剩余的筹码会兑换成金币","height":48,"fontSize":35,"font":"SimHei","color":"#ff8226","align":"left"}}]},{"type":"Box","props":{"x":720,"width":1440,"var":"boxTop","top":0,"height":106,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":33,"x":1169,"skin":"assets/ui.common/icon_Email.png"}},{"type":"Image","props":{"y":28,"x":1264,"skin":"assets/ui.common/icon_rank.png"}},{"type":"Image","props":{"y":16,"x":1351,"skin":"assets/ui.common/icon_setting.png"}},{"type":"Button","props":{"y":17,"x":29,"stateNum":"1","skin":"assets/ui.common/btn_Back.png"}},{"type":"Button","props":{"y":17,"x":136,"stateNum":"1","skin":"assets/ui.common/btn_table.png"}}]},{"type":"Box","props":{"x":720,"width":1440,"visible":true,"var":"boxMiddle","top":0,"height":900,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":163,"x":720,"skin":"assets/ui.game/img_playerFrame.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":68,"x":68,"width":70,"text":"坐下","height":35,"fontSize":35,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"left"}}]},{"type":"Image","props":{"y":211,"x":1070,"skin":"assets/ui.game/img_playerFrame.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":68,"x":68,"width":70,"text":"坐下","height":35,"fontSize":35,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"left"}}]},{"type":"Image","props":{"y":440,"x":1300,"skin":"assets/ui.game/img_playerFrame.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":68,"x":68,"width":70,"text":"坐下","height":35,"fontSize":35,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"left"}}]},{"type":"Image","props":{"y":648,"x":1070,"skin":"assets/ui.game/img_playerFrame.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":68,"x":68,"width":70,"text":"坐下","height":35,"fontSize":35,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"left"}}]},{"type":"Image","props":{"y":625,"x":720,"skin":"assets/ui.game/img_playerFrame.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":68,"x":68,"width":70,"text":"坐下","height":35,"fontSize":35,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"left"}}]},{"type":"Image","props":{"y":648,"x":370,"skin":"assets/ui.game/img_playerFrame.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":68,"x":68,"width":70,"text":"坐下","height":35,"fontSize":35,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"left"}}]},{"type":"Image","props":{"y":428,"x":140,"skin":"assets/ui.game/img_playerFrame.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":68,"x":68,"width":70,"text":"坐下","height":35,"fontSize":35,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"left"}}]},{"type":"Image","props":{"y":211,"x":370,"skin":"assets/ui.game/img_playerFrame.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":68,"x":68,"width":70,"text":"坐下","height":35,"fontSize":35,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"left"}}]}]}]};}
		]);
		return GameViewUI;
	})(View);
var LoaderViewUI=(function(_super){
		function LoaderViewUI(){
			
		    this.backgroud=null;
		    this.progress=null;
		    this.percent=null;
		    this.message=null;

			LoaderViewUI.__super.call(this);
		}

		CLASS$(LoaderViewUI,'ui.Views.LoaderViewUI',_super);
		var __proto__=LoaderViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(LoaderViewUI.uiView);
		}

		STATICATTR$(LoaderViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1136,"value":0.05,"height":640},"child":[{"type":"Image","props":{"y":0,"x":0,"width":1440,"var":"backgroud","skin":"assets/ui.loader/bg.png","sizeGrid":"28,9,5,9","height":900}},{"type":"ProgressBar","props":{"y":686,"x":720,"var":"progress","value":"0.05","skin":"assets/ui.loader/progress.png","sizeGrid":"2,2,2,4","anchorX":0.5}},{"type":"Label","props":{"y":710,"x":720,"var":"percent","text":"100%","fontSize":32,"color":"#ffffff","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":670,"x":720,"wordWrap":false,"width":600,"var":"message","valign":"middle","text":"正在加载......","height":40,"fontSize":38,"color":"#ffffff","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}}]};}
		]);
		return LoaderViewUI;
	})(View);
var MainViewUI=(function(_super){
		function MainViewUI(){
			
		    this.boxMiddle=null;
		    this.boxTop=null;
		    this.iconPlayer=null;
		    this.btnAdd=null;
		    this.labelBalance=null;
		    this.labelPlayerName=null;
		    this.boxNum=null;
		    this.labelOnlineNum=null;
		    this.btnPlay=null;

			MainViewUI.__super.call(this);
		}

		CLASS$(MainViewUI,'ui.Views.MainViewUI',_super);
		var __proto__=MainViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(MainViewUI.uiView);
		}

		STATICATTR$(MainViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"text":"100 ~ 2000"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"assets/ui.main/bg.png","name":"background"},"child":[{"type":"Image","props":{"y":746,"x":720,"skin":"assets/ui.main/bg_img_1.png","anchorX":0.5}}]},{"type":"Box","props":{"y":420,"x":720,"width":1440,"visible":true,"var":"boxMiddle","height":450,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Button","props":{"y":-45,"x":318,"stateNum":"1","skin":"assets/ui.common/btn_lv1.png","anchorX":0.5},"child":[{"type":"Image","props":{"y":453,"x":46,"skin":"assets/ui.common/img_title_3.png"}},{"type":"Image","props":{"y":463,"x":77.49999999999989,"skin":"assets/ui.common/img_man.png"}}]},{"type":"Button","props":{"y":24,"x":713,"stateNum":"1","skin":"assets/ui.common/btn_lv2.png","anchorX":0.5},"child":[{"type":"Image","props":{"y":383,"x":17,"skin":"assets/ui.common/img_title_4.png"}},{"type":"Image","props":{"y":394,"x":50.500000000000114,"skin":"assets/ui.common/img_man.png"}}]},{"type":"Button","props":{"y":-19,"x":1106,"stateNum":"1","skin":"assets/ui.common/btn_lv3.png","anchorX":0.5},"child":[{"type":"Image","props":{"y":425,"x":16,"skin":"assets/ui.common/img_title_5.png"}},{"type":"Image","props":{"y":437,"x":52,"skin":"assets/ui.common/img_man.png"}}]},{"type":"Image","props":{"y":502,"x":152,"skin":"assets/ui.main/img_bet.png"}},{"type":"Image","props":{"y":502,"x":528,"skin":"assets/ui.main/img_bet.png"}},{"type":"Image","props":{"y":502,"x":904,"skin":"assets/ui.main/img_bet.png"}},{"type":"Label","props":{"y":507,"x":317,"width":157,"text":"10~100","height":43,"fontSize":35,"font":"online","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":505,"x":698,"width":157,"text":"50~500","height":43,"fontSize":35,"font":"online","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":506,"x":1089,"width":198,"text":"100~2000","height":43,"fontSize":35,"font":"online","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":425,"x":253,"width":215,"text":"9999","height":51,"fontSize":35,"font":"people","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":425,"x":637,"width":215,"text":"9999","height":51,"fontSize":35,"font":"people","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":425,"x":1031,"width":215,"text":"9999","height":51,"fontSize":35,"font":"people","color":"#ffffff","align":"center"}}]},{"type":"Box","props":{"y":78,"x":720,"width":1440,"var":"boxTop","top":0,"height":156,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":38,"x":1096,"skin":"assets/ui.common/icon_Email.png"}},{"type":"Image","props":{"y":33,"x":1215,"skin":"assets/ui.common/icon_rank.png"}},{"type":"Image","props":{"y":24,"x":1325,"skin":"assets/ui.common/icon_setting.png"}},{"type":"Image","props":{"y":11,"x":20.999999999999886,"var":"iconPlayer"}},{"type":"Image","props":{"y":11,"x":20.999999999999886,"skin":"assets/ui.common/img_frame.png"}},{"type":"Image","props":{"y":17,"x":151,"skin":"assets/ui.common/img_title_2.png"}},{"type":"Image","props":{"y":76.00000000000006,"x":163.9999999999999,"skin":"assets/ui.common/img_bg_1.png"}},{"type":"Image","props":{"y":70.99999999999994,"x":166,"skin":"assets/ui.common/icon_balance_1.png"}},{"type":"Button","props":{"y":79.00000000000006,"x":422,"var":"btnAdd","stateNum":"2","skin":"assets/ui.common/btn_02.png"},"child":[{"type":"Image","props":{"y":8,"x":7,"skin":"assets/ui.common/img_add.png"}}]},{"type":"Label","props":{"y":91,"x":224.0000000000001,"width":197,"var":"labelBalance","text":"6666666","height":44,"fontSize":30,"font":"balance","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":23.00000000000003,"x":178,"width":359,"var":"labelPlayerName","text":"超级败家仔","height":48,"fontSize":35,"color":"#ffffff","align":"center"}}]},{"type":"Box","props":{"y":167,"x":720,"width":1440,"visible":true,"var":"boxNum","height":63,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":31,"x":720,"skin":"assets/ui.common/img_title_1.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":14,"x":459,"skin":"assets/ui.main/img_online_number.png"}},{"type":"Label","props":{"y":18,"x":668,"width":359,"var":"labelOnlineNum","text":"99999999","height":48,"fontSize":35,"font":"online_all","color":"#ffffff","align":"left"}}]},{"type":"Button","props":{"y":821,"x":720,"var":"btnPlay","stateNum":"2","skin":"assets/ui.common/btn_01.png","anchorY":0.5,"anchorX":0.5}}]};}
		]);
		return MainViewUI;
	})(View);