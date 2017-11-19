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
var MessageDialogUI=(function(_super){
		function MessageDialogUI(){
			
		    this.light=null;
		    this.winOrLost=null;
		    this.btnDouble=null;
		    this.btnClose=null;
		    this.jackPotBg=null;
		    this.IconResurts=null;
		    this.imageJackPot=null;
		    this.balanceIcon=null;
		    this.resultScore=null;
		    this.star=null;

			MessageDialogUI.__super.call(this);
		}

		CLASS$(MessageDialogUI,'ui.Dialogs.MessageDialogUI',_super);
		var __proto__=MessageDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(MessageDialogUI.uiView);
		}

		STATICATTR$(MessageDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1440,"height":900,"anchorY":0,"anchorX":0},"child":[{"type":"Image","props":{"y":450,"x":720,"visible":true,"skin":"assets/ui.common/message4.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":254,"x":720,"visible":true,"var":"light","skin":"assets/ui.reward/winLight.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":244,"x":720,"visible":true,"var":"winOrLost","skin":"assets/ui.reward/img_win.png","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":606,"x":877,"visible":true,"var":"btnDouble","stateNum":"3","skin":"assets/ui.common/btn_Bg4.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":25.999999999999886,"x":22.999999999999773,"skin":"assets/ui.reward/img_betMaxMin.png"}}]},{"type":"Button","props":{"y":606,"x":566,"visible":true,"var":"btnClose","stateNum":2,"skin":"assets/ui.common/btn_Bg6.png","name":"close","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":21.999999999999886,"x":37.999999999999886,"skin":"assets/ui.reward/back.png"}}]},{"type":"Image","props":{"y":510,"x":726,"visible":true,"var":"jackPotBg","skin":"assets/ui.common/message3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":332,"x":720,"var":"IconResurts","skin":"assets/ui.reward/results_4.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":488,"x":560,"var":"imageJackPot","skin":"assets/ui.reward/win.png"}},{"type":"Image","props":{"y":479,"x":488,"var":"balanceIcon","skin":"assets/ui.common/icon_balance_1.png"}},{"type":"Label","props":{"y":512,"x":818,"width":236,"visible":true,"var":"resultScore","text":90000,"height":46,"fontSize":48,"font":"win","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"y":298,"x":720,"visible":true,"var":"star","skin":"assets/ui.reward/winStar.png","anchorY":0.5,"anchorX":0.5}}]};}
		]);
		return MessageDialogUI;
	})(Dialog);
var DoubleViewUI=(function(_super){
		function DoubleViewUI(){
			
		    this.boxTop=null;
		    this.imgJackpot=null;
		    this.labelBalance=null;
		    this.btnAdd=null;
		    this.btnBulletin=null;
		    this.btnRank=null;
		    this.btnSetting=null;
		    this.boxNum=null;
		    this.tip=null;
		    this.boxMiddle=null;
		    this.poker=null;
		    this.btnBetSmall=null;
		    this.btnBetBig=null;
		    this.results_1=null;
		    this.results_2=null;
		    this.label_results_2=null;
		    this.label_results_1=null;
		    this.pokerLight=null;
		    this.boxBottom=null;
		    this.btnBack=null;
		    this.labelReward=null;
		    this.labelWinReward=null;
		    this.btnReady=null;

			DoubleViewUI.__super.call(this);
		}

		CLASS$(DoubleViewUI,'ui.Views.DoubleViewUI',_super);
		var __proto__=DoubleViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(DoubleViewUI.uiView);
		}

		STATICATTR$(DoubleViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1440,"height":900},"child":[{"type":"Box","props":{"y":0,"x":720,"width":1440,"var":"boxTop","top":0,"height":500,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"assets/ui.common/top.png"},"child":[{"type":"Image","props":{"y":10.000000000000028,"x":487.5,"var":"imgJackpot","skin":"assets/ui.double/ani_BoSize_1.png"}}]},{"type":"Image","props":{"y":25,"x":7.000000000000114,"skin":"assets/ui.common/message1.png"}},{"type":"Label","props":{"y":56,"x":163,"width":264,"var":"labelBalance","text":"999999","height":36,"fontSize":35,"font":"balance","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"y":18,"x":8,"skin":"assets/ui.common/icon_balance.png"}},{"type":"Button","props":{"y":27,"x":263,"var":"btnAdd","stateNum":"2","skin":"assets/ui.common/btn_blue.png"},"child":[{"type":"Image","props":{"y":8,"x":7,"skin":"assets/ui.common/img_add.png"}}]},{"type":"Button","props":{"y":26,"x":1135,"var":"btnBulletin","stateNum":"1","skin":"assets/ui.common/btn_bulletin.png"}},{"type":"Button","props":{"y":26,"x":1220,"var":"btnRank","stateNum":"1","skin":"assets/ui.common/btn_rank.png"}},{"type":"Button","props":{"y":26,"x":1314,"var":"btnSetting","stateNum":"1","skin":"assets/ui.common/btn_settiing.png"}}]},{"type":"Box","props":{"y":850,"x":720,"width":1440,"visible":false,"var":"boxNum","height":63,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":29,"x":720,"skin":"assets/ui.double/img_Bg.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":31.000000000000227,"x":720,"var":"tip","skin":"assets/ui.double/img_winLabel.png","anchorY":0.5,"anchorX":0.5}}]},{"type":"Box","props":{"y":410,"x":720,"width":1440,"visible":true,"var":"boxMiddle","height":450,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":312,"x":720,"var":"poker","skin":"assets/ui.common/poker.png","name":"poker","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":312,"x":450,"visible":true,"var":"btnBetSmall","stateNum":"3","skin":"assets/ui.common/btn_Bg.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":27,"x":24,"skin":"assets/ui.common/img_betMin_1.png","name":"img"}}]},{"type":"Button","props":{"y":312,"x":990,"visible":true,"var":"btnBetBig","stateNum":"3","skin":"assets/ui.common/btn_Bg.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":27,"x":24,"skin":"assets/ui.common/img_betMax_1.png","name":"img"}}]},{"type":"Image","props":{"y":15,"x":720,"skin":"assets/ui.double/middle_center.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Box","props":{"y":-4,"x":153,"visible":false,"var":"results_1"},"child":[{"type":"Image","props":{"y":9.000000000000014,"x":7.000000000000114,"skin":"assets/ui.common/img_rightTopLight.png"}},{"type":"Image","props":{"y":85.00000000000001,"x":10.000000000000114,"skin":"assets/ui.common/img_rightBottomLight.png"}},{"type":"Image","props":{"y":1.4210854715202004e-14,"x":-0.9999999999998863,"skin":"assets/ui.common/img_rightLight.png"}}]},{"type":"Box","props":{"y":-4,"x":-3,"visible":false,"var":"results_2"},"child":[{"type":"Image","props":{"y":10,"x":7,"skin":"assets/ui.common/img_leftTopLight.png"}},{"type":"Image","props":{"y":84,"x":8,"skin":"assets/ui.common/img_leftBottomLight.png"}},{"type":"Image","props":{"skin":"assets/ui.common/img_leftLight.png"}}]},{"type":"Image","props":{"y":16,"x":52,"skin":"assets/ui.double/img_small.png"}},{"type":"Image","props":{"y":16.5,"x":207,"skin":"assets/ui.double/img_big.png"}}]},{"type":"Image","props":{"y":35.99999999999994,"x":601.0000000000001,"var":"label_results_2","skin":"assets/ui.double/img_small_num.png"}},{"type":"Image","props":{"y":35.99999999999994,"x":748.0000000000001,"var":"label_results_1","skin":"assets/ui.double/img_big_num.png"}},{"type":"Image","props":{"y":105,"x":555,"width":0,"var":"pokerLight","height":0}}]},{"type":"Box","props":{"y":775,"x":720,"width":1440,"var":"boxBottom","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":88,"x":720,"width":1440,"skin":"assets/ui.double/bottom.png","sizeGrid":"0,300,0,300","anchorX":0.5}},{"type":"Button","props":{"y":140,"x":259,"var":"btnBack","stateNum":"2","skin":"assets/ui.common/btn_Bg6.png","anchorX":0.5},"child":[{"type":"Image","props":{"y":18,"x":37,"skin":"assets/ui.double/back.png"}}]},{"type":"Image","props":{"y":137,"x":519,"skin":"assets/ui.double/bottom_middle.png","anchorX":0.5},"child":[{"type":"Label","props":{"y":77,"x":135,"width":264,"var":"labelReward","text":"999999","height":36,"fontSize":35,"font":"prcent","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"y":11.999999999999886,"x":70.99999999999989,"skin":"assets/ui.double/img_reward.png"}}]},{"type":"Image","props":{"y":137,"x":912,"skin":"assets/ui.double/bottom_middle.png","anchorX":0.5},"child":[{"type":"Image","props":{"y":12,"x":134,"skin":"assets/ui.double/img_win_reward.png","anchorX":0.5}},{"type":"Label","props":{"y":77,"x":134,"width":264,"var":"labelWinReward","text":"999999","height":36,"fontSize":35,"font":"prcent","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Button","props":{"y":135,"x":1177,"var":"btnReady","stateNum":"2","skin":"assets/ui.common/btn_Bg8.png","anchorX":0.5},"child":[{"type":"Image","props":{"y":18,"x":37,"skin":"assets/ui.double/img_next.png"}}]},{"type":"Image","props":{"y":168,"x":720,"skin":"assets/ui.double/arrow.png","anchorX":0.5}}]}]};}
		]);
		return DoubleViewUI;
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
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":-2,"x":0,"width":1440,"var":"backgroud","skin":"assets/ui.loader/bg.png","sizeGrid":"28,9,5,9","height":900}},{"type":"ProgressBar","props":{"y":694,"x":720,"var":"progress","value":0.5,"skin":"assets/ui.loader/progress.png","sizeGrid":"2,2,2,4","anchorX":0.5}},{"type":"Label","props":{"y":718,"x":720,"var":"percent","text":"100%","fontSize":32,"color":"#ffffff","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":670,"x":720,"wordWrap":false,"width":600,"var":"message","valign":"middle","text":"正在加载......","height":40,"fontSize":38,"color":"#ffffff","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}}]};}
		]);
		return LoaderViewUI;
	})(View);
var TableViewUI=(function(_super){
		function TableViewUI(){
			
		    this.girl=null;
		    this.tipBg=null;
		    this.labelTip=null;
		    this.boxMiddle=null;
		    this.poker1=null;
		    this.poker3=null;
		    this.poker2=null;
		    this.boxTop=null;
		    this.topNode=null;
		    this.jackpotBg=null;
		    this.labelJackpot=null;
		    this.imgJackpot=null;
		    this.boxJackpootLight=null;
		    this.labelBalance=null;
		    this.btnAdd=null;
		    this.btnBulletin=null;
		    this.btnRank=null;
		    this.btnSetting=null;
		    this.results_2=null;
		    this.results_1=null;
		    this.results_3=null;
		    this.label_results_2=null;
		    this.label_results_1=null;
		    this.label_results_3=null;
		    this.boxBottom=null;
		    this.doubleInfoBg=null;
		    this.labelBetAmount=null;
		    this.btnBack=null;
		    this.btnDraw=null;
		    this.btnDouble=null;
		    this.btnHalf=null;
		    this.btnBetSmall=null;
		    this.btnBetBig=null;
		    this.btnBetOn=null;
		    this.labelshootPrcent=null;
		    this.boxNum=null;
		    this.labelGoldNum=null;
		    this.labelRemobeGold=null;
		    this.pokerLightNode=null;
		    this.boxRight=null;
		    this.boxShoot=null;
		    this.boxNoShoot=null;

			TableViewUI.__super.call(this);
		}

		CLASS$(TableViewUI,'ui.Views.TableViewUI',_super);
		var __proto__=TableViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(TableViewUI.uiView);
		}

		STATICATTR$(TableViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"text":"请押注","name":"img"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"assets/ui.common/backgroud.png","name":"background"},"child":[{"type":"Image","props":{"y":31.000000000000057,"x":0,"var":"girl"},"child":[{"type":"Image","props":{"y":333.99999999999994,"x":114.20999999999995,"var":"tipBg","skin":"assets/ui.common/tipBG.png","sizeGrid":"60,40,30,75","anchorX":0.27},"child":[{"type":"Label","props":{"y":34,"x":13,"wordWrap":true,"width":250,"var":"labelTip","valign":"middle","text":"请押注","height":71,"fontSize":27,"font":"SimHei","color":"#000000","align":"center"}}]}]}]},{"type":"Box","props":{"y":430,"x":720,"width":1440,"visible":false,"var":"boxMiddle","height":450,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":255,"x":450,"var":"poker1","skin":"assets/ui.common/poker.png","name":"poker1","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":255,"x":720,"var":"poker3","skin":"assets/ui.common/poker.png","name":"poker3","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":255,"x":990,"var":"poker2","skin":"assets/ui.common/poker.png","name":"poker2","anchorY":0.5,"anchorX":0.5}}]},{"type":"Box","props":{"x":720,"width":1440,"var":"boxTop","top":0,"height":500,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"topNode","skin":"assets/ui.common/top.png"},"child":[{"type":"Image","props":{"y":13,"x":728,"var":"jackpotBg","skin":"assets/ui.common/jackPot_bg.png","anchorY":0,"anchorX":0}},{"type":"Label","props":{"y":57,"x":872,"width":261,"var":"labelJackpot","text":"999999","height":47,"fontSize":30,"font":"jackpot_1","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"y":9.999999999999972,"x":410.9999999999999,"var":"imgJackpot","skin":"assets/ui.common/jackPot1.png"}},{"type":"Box","props":{"y":7.999999999999943,"x":723,"var":"boxJackpootLight"},"child":[{"type":"Image","props":{"y":1,"x":1,"skin":"assets/effects/10001/10001_1.png"}},{"type":"Image","props":{"skin":"assets/effects/10001/10001_2.png"}}]}]},{"type":"Image","props":{"y":25,"x":7.000000000000114,"skin":"assets/ui.common/message1.png"}},{"type":"Label","props":{"y":56,"x":163,"width":264,"var":"labelBalance","text":"999999","height":36,"fontSize":35,"font":"balance","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"y":18,"x":8,"skin":"assets/ui.common/icon_balance.png"}},{"type":"Button","props":{"y":27,"x":263,"var":"btnAdd","stateNum":"2","skin":"assets/ui.common/btn_blue.png"},"child":[{"type":"Image","props":{"y":8,"x":7,"skin":"assets/ui.common/img_add.png"}}]},{"type":"Button","props":{"y":26,"x":1135,"var":"btnBulletin","stateNum":"1","skin":"assets/ui.common/btn_bulletin.png"}},{"type":"Button","props":{"y":26,"x":1220,"var":"btnRank","stateNum":"1","skin":"assets/ui.common/btn_rank.png"}},{"type":"Button","props":{"y":26,"x":1314,"var":"btnSetting","stateNum":"1","skin":"assets/ui.common/btn_settiing.png"}},{"type":"Image","props":{"y":190,"x":720,"skin":"assets/ui.common/middle.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Box","props":{"y":-4,"x":151,"visible":false,"var":"results_2"},"child":[{"type":"Image","props":{"y":9.000000000000014,"x":7.000000000000114,"skin":"assets/ui.common/img_middleTopLight.png"}},{"type":"Image","props":{"y":85.00000000000001,"x":10.000000000000114,"skin":"assets/ui.common/img_middleBottomLight.png"}},{"type":"Image","props":{"y":1.4210854715202004e-14,"x":-0.9999999999998863,"skin":"assets/ui.common/img_middleLight.png"}}]},{"type":"Box","props":{"y":-4,"x":305,"visible":false,"var":"results_1"},"child":[{"type":"Image","props":{"y":9.000000000000014,"x":7.000000000000114,"skin":"assets/ui.common/img_rightTopLight.png"}},{"type":"Image","props":{"y":85.00000000000001,"x":10.000000000000114,"skin":"assets/ui.common/img_rightBottomLight.png"}},{"type":"Image","props":{"y":1.4210854715202004e-14,"x":-0.9999999999998863,"skin":"assets/ui.common/img_rightLight.png"}}]},{"type":"Box","props":{"y":-4,"x":-3,"visible":false,"var":"results_3"},"child":[{"type":"Image","props":{"y":10,"x":7,"skin":"assets/ui.common/img_leftTopLight.png"}},{"type":"Image","props":{"y":84,"x":8,"skin":"assets/ui.common/img_leftBottomLight.png"}},{"type":"Image","props":{"skin":"assets/ui.common/img_leftLight.png"}}]},{"type":"Image","props":{"y":23,"x":18,"skin":"assets/ui.common/streight_flush.png"}},{"type":"Image","props":{"y":23,"x":194,"skin":"assets/ui.common/streight.png"}},{"type":"Image","props":{"y":21.5,"x":347,"skin":"assets/ui.common/shoot.png"}}]},{"type":"Label","props":{"y":211,"x":670,"width":100,"var":"label_results_2","text":"x 2","height":42,"fontSize":30,"font":"poker_1","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":211,"x":825,"width":100,"var":"label_results_1","text":"x 1","height":42,"fontSize":30,"font":"poker_1","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":211,"x":512.9999999999999,"width":100,"var":"label_results_3","text":"x 4","height":42,"fontSize":30,"font":"poker_1","color":"#ffffff","align":"center"}}]},{"type":"Box","props":{"y":775,"x":720,"width":1440,"var":"boxBottom","height":250,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":49,"x":0,"skin":"assets/ui.common/bottom.png"}},{"type":"Image","props":{"y":80,"x":720,"var":"doubleInfoBg","skin":"assets/ui.common/bottom_center.png","anchorX":0.5}},{"type":"Image","props":{"y":96,"x":540,"skin":"assets/ui.common/button_stake.png"}},{"type":"Label","props":{"y":200,"x":725,"width":350,"var":"labelBetAmount","text":"9999999","height":40,"fontSize":40,"font":"bet","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Button","props":{"y":141,"x":9,"var":"btnBack","stateNum":"2","skin":"assets/ui.common/btn_Bg6.png"},"child":[{"type":"Image","props":{"y":22,"x":45,"skin":"assets/ui.common/backTitle.png"}}]},{"type":"Button","props":{"y":98,"x":1213,"var":"btnDraw","stateNum":"2","skin":"assets/ui.common/btn_Bg2.png"},"child":[{"type":"Image","props":{"y":35.999999999999886,"x":42.99999999999977,"skin":"assets/ui.common/showPoker.png","name":"img"}}]},{"type":"Button","props":{"y":167,"x":825,"visible":false,"var":"btnDouble","stateNum":"2","skin":"assets/ui.common/btn_Bg3.png"},"child":[{"type":"Image","props":{"y":11,"x":16,"skin":"assets/ui.common/stakeAdd.png"}}]},{"type":"Button","props":{"y":167,"x":554,"visible":false,"var":"btnHalf","stateNum":"2","skin":"assets/ui.common/btn_Bg3.png"},"child":[{"type":"Image","props":{"y":24,"x":15,"skin":"assets/ui.common/stakeCut.png"}}]},{"type":"Button","props":{"y":133,"x":179,"visible":false,"var":"btnBetSmall","stateNum":"3","skin":"assets/ui.common/btn_Bg.png"},"child":[{"type":"Image","props":{"y":27,"x":24,"skin":"assets/ui.common/img_betMin_1.png","name":"img"}}]},{"type":"Button","props":{"y":133,"x":342,"visible":false,"var":"btnBetBig","stateNum":"3","skin":"assets/ui.common/btn_Bg.png"},"child":[{"type":"Image","props":{"y":27,"x":24,"skin":"assets/ui.common/img_betMax_1.png","name":"img"}}]},{"type":"Button","props":{"y":133,"x":970,"var":"btnBetOn","stateNum":"3","skin":"assets/ui.common/btn_Bg4.png"},"child":[{"type":"Image","props":{"y":23,"x":32,"skin":"assets/ui.common/img_bet_1.png","name":"img"}}]},{"type":"Image","props":{"y":140,"x":229,"skin":"assets/ui.common/bottom_left.png"},"child":[{"type":"Image","props":{"y":13,"x":66.00000000000006,"skin":"assets/ui.common/img_shoot_probability.png"}},{"type":"Label","props":{"y":82,"x":134,"width":207,"var":"labelshootPrcent","text":"100%","height":40,"fontSize":40,"font":"prcent","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}}]}]},{"type":"Box","props":{"y":659,"x":720,"width":1037,"visible":true,"var":"boxNum","height":63,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":29,"x":498.5,"skin":"assets/ui.common/message2.png","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":39,"x":382.5,"width":350,"var":"labelGoldNum","text":"9999999","height":40,"fontSize":30,"font":"beted","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":40,"x":764.5,"width":350,"var":"labelRemobeGold","text":"9999999","height":40,"fontSize":30,"font":"beted","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"y":17,"x":526,"skin":"assets/ui.common/img_hit_column.png"}},{"type":"Image","props":{"y":17,"x":180,"skin":"assets/ui.common/img_betAmount.png"}}]},{"type":"Image","props":{"y":285.00000000000006,"x":315.0000000000001,"var":"pokerLightNode"}},{"type":"Image","props":{"y":104,"x":1440,"visible":false,"var":"boxRight","skin":"assets/ui.common/right.png","anchorX":1},"child":[{"type":"Image","props":{"y":404,"x":21.5,"skin":"assets/ui.common/right_top.png","sizeGrid":"20,20,20,20"}},{"type":"Image","props":{"y":74,"x":15,"skin":"assets/ui.common/right_bottom.png","sizeGrid":"20,20,20,20"}},{"type":"Image","props":{"y":12,"x":73.50000000000023,"skin":"assets/ui.common/img_shoot.png"}},{"type":"Image","props":{"y":346.00000000000006,"x":73,"skin":"assets/ui.common/img_noshoot.png"}},{"type":"Box","props":{"y":84,"x":28,"width":155,"var":"boxShoot","height":237}},{"type":"Box","props":{"y":415,"x":29,"width":150,"var":"boxNoShoot","height":197}}]}]};}
		]);
		return TableViewUI;
	})(View);