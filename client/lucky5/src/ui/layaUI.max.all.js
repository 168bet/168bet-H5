var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var LogoBoxUI=(function(_super){
		function LogoBoxUI(){
			

			LogoBoxUI.__super.call(this);
		}

		CLASS$(LogoBoxUI,'ui.boxes.LogoBoxUI',_super);
		var __proto__=LogoBoxUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(LogoBoxUI.uiView);
		}

		STATICATTR$(LogoBoxUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":414,"height":290},"child":[{"type":"Image","props":{"y":0,"x":0,"visible":true,"skin":"assets/ui.common/element27.png"}},{"type":"Sprite","props":{"y":0,"x":0,"name":"ani.table.win"}},{"type":"Image","props":{"y":0,"x":0,"visible":true,"skin":"assets/ui.common/element20.png"}},{"type":"Sprite","props":{"y":0,"x":0,"name":"ani.blue.light"}},{"type":"Image","props":{"y":15,"x":0,"visible":true,"skin":"assets/ui.common/element17.png"}},{"type":"Sprite","props":{"y":0,"x":0,"name":"ani.table.five"}},{"type":"Image","props":{"y":0,"x":0,"skin":"assets/ui.common/element14.png"}},{"type":"Sprite","props":{"name":"ani.blink.star"}}]};}
		]);
		return LogoBoxUI;
	})(View);
var MessageBoxUI=(function(_super){
		function MessageBoxUI(){
			
		    this.textMessage=null;

			MessageBoxUI.__super.call(this);
		}

		CLASS$(MessageBoxUI,'ui.boxes.MessageBoxUI',_super);
		var __proto__=MessageBoxUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(MessageBoxUI.uiView);
		}

		STATICATTR$(MessageBoxUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":800,"height":200},"child":[{"type":"Image","props":{"width":800,"top":0,"skin":"assets/ui.table/message2.png","sizeGrid":"8,2,5,2","left":0,"height":200}},{"type":"Label","props":{"wordWrap":true,"width":800,"var":"textMessage","valign":"middle","text":"庄家赢了","height":200,"fontSize":80,"font":"Helvetica","color":"#ffffff","bold":true,"align":"center"}}]};}
		]);
		return MessageBoxUI;
	})(View);
var RecordBoxUI=(function(_super){
		function RecordBoxUI(){
			

			RecordBoxUI.__super.call(this);
		}

		CLASS$(RecordBoxUI,'ui.boxes.RecordBoxUI',_super);
		var __proto__=RecordBoxUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(RecordBoxUI.uiView);
		}

		STATICATTR$(RecordBoxUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":400,"height":40},"child":[{"type":"Label","props":{"width":400,"valign":"middle","text":"[W]押注 40 J以上对子 奖金400","name":"desc","height":40,"fontSize":26,"color":"#ffffff","align":"left"}}]};}
		]);
		return RecordBoxUI;
	})(View);
var MessageDialogUI=(function(_super){
		function MessageDialogUI(){
			
		    this.lucky5Bg=null;
		    this.btnDouble=null;
		    this.winOrLost=null;
		    this.imageJackPot=null;
		    this.labelScore=null;

			MessageDialogUI.__super.call(this);
		}

		CLASS$(MessageDialogUI,'ui.dialogs.MessageDialogUI',_super);
		var __proto__=MessageDialogUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(MessageDialogUI.uiView);
		}

		STATICATTR$(MessageDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1440,"height":900,"anchorY":0,"anchorX":0},"child":[{"type":"Image","props":{"y":450,"x":720,"visible":true,"skin":"assets/ui.table/Bg4.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":450,"x":720,"visible":true,"skin":"assets/ui.table/Bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":362,"x":722,"visible":true,"skin":"assets/ui.table/Bg2.png","name":"bg_logo","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":642,"x":722,"visible":true,"skin":"assets/ui.table/Bg1.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":175,"x":460,"visible":false,"var":"lucky5Bg","skin":"assets/ui.common/element27.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":137,"x":722,"visible":true,"skin":"assets/ui.table/congratulations.png","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":799,"x":887,"visible":true,"var":"btnDouble","stateNum":2,"skin":"assets/ui.table/btn_double2.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":17.999999999999886,"x":46.99999999999977,"skin":"assets/ui.table/gamblingSize.png"}}]},{"type":"Button","props":{"y":799,"x":576,"visible":true,"stateNum":2,"skin":"assets/ui.table/btn_back2.png","name":"close","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":17.999999999999886,"x":71.99999999999989,"skin":"assets/ui.table/continue.png"}}]},{"type":"Image","props":{"y":642,"x":726,"visible":true,"skin":"assets/ui.table/blueBg2.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":576,"x":657,"visible":true,"var":"winOrLost","skin":"assets/ui.table/massageView_Win.png"}},{"type":"Image","props":{"y":581,"x":596,"visible":false,"var":"imageJackPot","skin":"assets/ui.table/jackPot2.png"}},{"type":"Label","props":{"y":675,"x":734,"width":400,"visible":true,"var":"labelScore","valign":"middle","text":90000,"fontSize":48,"font":"golden_orange","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}}]};}
		]);
		return MessageDialogUI;
	})(Dialog);
var DoubleViewUI=(function(_super){
		function DoubleViewUI(){
			
		    this.boxTop=null;
		    this.aniLight=null;
		    this.boxLogo=null;
		    this.aniLogo=null;
		    this.playTimesBg=null;
		    this.playTimesTitle=null;
		    this.labelPlayTimes=null;
		    this.banker=null;
		    this.bonus=null;
		    this.MultipleNum=null;
		    this.boxMiddle=null;
		    this.poker1=null;
		    this.poker2=null;
		    this.poker3=null;
		    this.poker4=null;
		    this.poker5=null;
		    this.boxBottom=null;
		    this.labelScore=null;
		    this.btnBack=null;
		    this.backTitle=null;
		    this.btnDeal=null;
		    this.btnDouble=null;
		    this.btnHalf=null;

			DoubleViewUI.__super.call(this);
		}

		CLASS$(DoubleViewUI,'ui.views.DoubleViewUI',_super);
		var __proto__=DoubleViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(DoubleViewUI.uiView);
		}

		STATICATTR$(DoubleViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1440,"visible":true,"height":900},"child":[{"type":"Image","props":{"skin":"assets/ui.table/backgroud.png","name":"background"}},{"type":"Box","props":{"width":1440,"visible":true,"var":"boxTop","top":0,"left":0,"height":300,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"var":"aniLight","top":-80,"skin":"assets/ui.table/lightBg.png","left":450,"anchorY":0.5,"anchorX":0.5}},{"type":"Box","props":{"width":380,"visible":true,"var":"boxLogo","top":0,"left":500,"height":300},"child":[{"type":"Image","props":{"top":0,"skin":"assets/ui.common/element13.png","left":0}},{"type":"Sprite","props":{"y":0,"x":0,"var":"aniLogo"}},{"type":"Image","props":{"top":0,"skin":"assets/ui.common/element4.png","left":0,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"top":0,"skin":"assets/ui.common/element5.png","left":0,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":0,"x":-1.1368683772161603e-13,"top":0,"skin":"assets/ui.common/element1.png","left":0,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Image","props":{"y":138,"x":1110,"visible":false,"var":"playTimesBg","skin":"assets/ui.table/playTimesBg.png"}},{"type":"Image","props":{"y":153,"x":1123,"visible":false,"var":"playTimesTitle","skin":"assets/ui.table/playTimes.png"}},{"type":"Label","props":{"y":146,"x":1265,"width":150,"visible":false,"var":"labelPlayTimes","valign":"middle","text":"999999","height":40,"fontSize":40,"font":"gray","color":"#ffffff","align":"left"}},{"type":"Image","props":{"y":217.99999999999994,"x":30,"var":"banker","skin":"assets/ui.double/banker.png"}},{"type":"Image","props":{"y":244,"x":253,"visible":false,"var":"bonus","skin":"assets/ui.table/randomMultipleLightBg.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":94,"x":93,"skin":"assets/ui.table/randowStakeBg.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":93,"x":94,"var":"MultipleNum","skin":"assets/ui.table/randomMultiple_3.png","anchorY":0.5,"anchorX":0.5}}]}]},{"type":"Box","props":{"y":469,"x":721,"width":1440,"var":"boxMiddle","height":450,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":272,"x":159,"var":"poker1","skin":"assets/ui.table/poker.png","pivotY":165,"pivotX":127,"name":"poker1"}},{"type":"Image","props":{"y":272,"x":443,"var":"poker2","skin":"assets/ui.table/poker.png","pivotY":165,"pivotX":127,"name":"poker2"}},{"type":"Image","props":{"y":272,"x":726,"var":"poker3","skin":"assets/ui.table/poker.png","pivotY":165,"pivotX":127,"name":"poker3"}},{"type":"Image","props":{"y":272,"x":1005,"var":"poker4","skin":"assets/ui.table/poker.png","pivotY":165,"pivotX":127,"name":"poker4"}},{"type":"Image","props":{"y":272,"x":1289,"var":"poker5","skin":"assets/ui.table/poker.png","pivotY":165,"pivotX":127,"name":"poker5"}}]},{"type":"Box","props":{"y":775,"x":720,"width":1440,"var":"boxBottom","height":250,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":81,"x":0,"skin":"assets/ui.table/bottom.png"}},{"type":"Image","props":{"y":130,"x":1204,"skin":"assets/ui.table/Bg6.png","scaleX":-1}},{"type":"Image","props":{"y":80,"x":526,"skin":"assets/ui.table/Bg5.png"}},{"type":"Image","props":{"y":130,"x":244,"skin":"assets/ui.table/Bg6.png"}},{"type":"Image","props":{"y":141,"x":345,"skin":"assets/ui.table/remainder.png"}},{"type":"Image","props":{"y":147,"x":1021,"skin":"assets/ui.table/doubleWin.png"}},{"type":"Image","props":{"y":96,"x":544,"skin":"assets/ui.table/button_stake.png"},"child":[{"type":"Image","props":{"y":6.999999999999886,"x":123,"skin":"assets/ui.table/doubleStakeTitle.png"}}]},{"type":"Label","props":{"y":186,"x":255,"width":250,"valign":"middle","text":"99999999","name":"balance","height":40,"fontSize":40,"font":"gray_small","color":"#ffffff","align":"center"}},{"type":"Label","props":{"y":196,"x":725,"width":350,"valign":"middle","text":"9999999","name":"betAmount","height":40,"fontSize":40,"font":"gray_big","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":186,"x":939,"width":260,"var":"labelScore","valign":"middle","text":"99999999","height":40,"fontSize":40,"font":"gray_small","color":"#ffffff","align":"center"}},{"type":"Button","props":{"y":131,"x":11,"var":"btnBack","stateNum":"2","skin":"assets/ui.table/btn_Bg4.png"},"child":[{"type":"Image","props":{"y":23.999999999999886,"x":49,"var":"backTitle","skin":"assets/ui.table/backTitle.png"}}]},{"type":"Button","props":{"y":96,"x":1213,"var":"btnDeal","stateNum":"2","skin":"assets/ui.table/btn_Bg2.png"},"child":[{"type":"Image","props":{"y":35.999999999999886,"x":42.99999999999977,"skin":"assets/ui.table/showPoker.png"}}]},{"type":"Button","props":{"y":167,"x":825,"var":"btnDouble","stateNum":"2","skin":"assets/ui.table/btn_Bg3.png"},"child":[{"type":"Image","props":{"y":16,"x":6,"skin":"assets/ui.double/double.png"}}]},{"type":"Button","props":{"y":167,"x":554,"var":"btnHalf","stateNum":"2","skin":"assets/ui.table/btn_Bg3.png"},"child":[{"type":"Image","props":{"y":16,"x":6,"skin":"assets/ui.double/half.png"}}]}]}]};}
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

		CLASS$(LoaderViewUI,'ui.views.LoaderViewUI',_super);
		var __proto__=LoaderViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(LoaderViewUI.uiView);
		}

		STATICATTR$(LoaderViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":0,"x":0,"width":1440,"var":"backgroud","skin":"assets/ui.loader/bg.png","sizeGrid":"28,9,5,9","height":900}},{"type":"ProgressBar","props":{"y":686,"x":276,"var":"progress","skin":"assets/ui.loader/progress.png","sizeGrid":"2,2,2,37"}},{"type":"Label","props":{"y":724,"x":734,"var":"percent","text":"100%","fontSize":32,"color":"#ffffff","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":670,"x":720,"wordWrap":false,"width":600,"var":"message","valign":"middle","text":"正在加载......","height":40,"fontSize":38,"color":"#ffffff","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}}]};}
		]);
		return LoaderViewUI;
	})(View);
var TableViewUI=(function(_super){
		function TableViewUI(){
			
		    this.boxTop=null;
		    this.listRecord=null;
		    this.resultBar=null;
		    this.boxMiddle=null;
		    this.boxBottom=null;
		    this.buttonStake=null;
		    this.buttonDeal=null;
		    this.buttonDraw=null;
		    this.buttonHelp=null;
		    this.buttonMusic=null;
		    this.btnStakeAdd=null;
		    this.btnStakeCut=null;
		    this.textBalance=null;
		    this.textBetAmount=null;

			TableViewUI.__super.call(this);
		}

		CLASS$(TableViewUI,'ui.views.TableViewUI',_super);
		var __proto__=TableViewUI.prototype;
		__proto__.createChildren=function(){
		    
			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(TableViewUI.uiView);
		}

		STATICATTR$(TableViewUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1440,"visible":true,"height":900},"child":[{"type":"Image","props":{"y":450,"x":720,"visible":true,"skin":"assets/ui.table/backgroud.png","pivotY":450,"pivotX":720,"name":"backgroud"}},{"type":"Box","props":{"y":-6,"x":-5,"width":1440,"visible":true,"var":"boxTop","height":390},"child":[{"type":"Image","props":{"y":0,"x":4.000000000000125,"skin":"assets/ui.table/bg_top_left.png","name":"bg_topleft","left":4}},{"type":"Label","props":{"y":25,"x":751,"valign":"middle","text":"记录","fontSize":38,"color":"#ffffff","align":"center"}},{"type":"List","props":{"y":80,"x":610,"width":400,"var":"listRecord","spaceY":6,"repeatY":6,"repeatX":1,"height":290}},{"type":"Image","props":{"y":0,"x":994,"skin":"assets/ui.table/bg_top_right.png","right":-2,"name":"bg_topright"}},{"type":"Image","props":{"y":260.99999999999994,"x":1031.0000000000002,"visible":true,"skin":"assets/ui.table/blueBg.png","name":"bg_jackpot"}},{"type":"Image","props":{"y":353,"x":15,"width":580,"var":"resultBar","skin":"assets/ui.table/resultBar.png","height":34,"anchorY":0.5}},{"type":"Label","props":{"y":38,"x":577,"width":200,"valign":"middle","text":"5000","name":"reward_10","fontSize":38,"font":"white_Violet","color":"#ffffff","anchorY":0.5,"anchorX":1,"align":"right"}},{"type":"Label","props":{"y":74,"x":577,"width":200,"valign":"middle","text":"2000","name":"reward_9","height":40,"fontSize":38,"font":"white_Violet","color":"#ffffff","anchorY":0.5,"anchorX":1,"align":"right"}},{"type":"Label","props":{"y":109,"x":577,"width":200,"valign":"middle","text":"1200","name":"reward_8","fontSize":38,"font":"white_Violet","color":"#ffffff","anchorY":0.5,"anchorX":1,"align":"right"}},{"type":"Label","props":{"y":143,"x":577,"width":200,"valign":"middle","text":"400","name":"reward_7","fontSize":38,"font":"white_Violet","color":"#ffffff","anchorY":0.5,"anchorX":1,"align":"right"}},{"type":"Label","props":{"y":178,"x":577,"width":200,"valign":"middle","text":"100","name":"reward_6","fontSize":38,"font":"white_Violet","color":"#ffffff","anchorY":0.5,"anchorX":1,"align":"right"}},{"type":"Label","props":{"y":211,"x":577,"width":200,"valign":"middle","text":"70","name":"reward_5","fontSize":38,"font":"white_Violet","color":"#ffffff","anchorY":0.5,"anchorX":1,"align":"right"}},{"type":"Label","props":{"y":246,"x":577,"width":200,"valign":"middle","text":"50","name":"reward_4","fontSize":38,"font":"white_Violet","color":"#ffffff","anchorY":0.5,"anchorX":1,"align":"right"}},{"type":"Label","props":{"y":281,"x":577,"width":200,"valign":"middle","text":"30","name":"reward_3","fontSize":38,"font":"white_Violet","color":"#ffffff","anchorY":0.5,"anchorX":1,"align":"right"}},{"type":"Label","props":{"y":316,"x":577,"width":200,"valign":"middle","text":"20","name":"reward_2","fontSize":38,"font":"white_Violet","color":"#ffffff","anchorY":0.5,"anchorX":1,"align":"right"}},{"type":"Label","props":{"y":351,"x":577,"width":200,"valign":"middle","text":"10","name":"reward_1","fontSize":38,"font":"white_Violet","color":"#ffffff","anchorY":0.5,"anchorX":1,"align":"right"}},{"type":"Label","props":{"y":352,"x":21,"width":200,"valign":"middle","text":"J以上对子","strokeColor":"#2e034b","stroke":7,"name":"result_1","height":30,"fontSize":26,"color":"#fffbfb","anchorY":0.5,"align":"left"}},{"type":"Label","props":{"y":318,"x":21,"width":200,"valign":"middle","text":"两对","strokeColor":"#2e034b","stroke":7,"name":"result_2","height":40,"fontSize":26,"color":"#ffffff","anchorY":0.5,"align":"left"}},{"type":"Label","props":{"y":283,"x":21,"width":200,"valign":"middle","text":"三条","strokeColor":"#2e034b","stroke":7,"name":"result_3","height":40,"fontSize":26,"color":"#ffffff","anchorY":0.5,"anchorX":0,"align":"left"}},{"type":"Label","props":{"y":249,"x":21,"width":200,"valign":"middle","text":"顺子","strokeColor":"#2e034b","stroke":7,"name":"result_4","height":40,"fontSize":26,"color":"#ffffff","anchorY":0.5,"align":"left"}},{"type":"Label","props":{"y":214,"x":21,"width":200,"valign":"middle","text":"同花","strokeColor":"#2e034b","stroke":7,"name":"result_5","height":40,"fontSize":26,"color":"#ffffff","anchorY":0.5,"anchorX":0,"align":"left"}},{"type":"Label","props":{"y":180,"x":21,"width":200,"valign":"middle","text":"葫芦","strokeColor":"#2e034b","stroke":7,"name":"result_6","height":40,"fontSize":26,"color":"#ffffff","anchorY":0.5,"anchorX":0,"align":"left"}},{"type":"Label","props":{"y":145,"x":21,"width":200,"valign":"middle","text":"四梅","strokeColor":"#2e034b","stroke":7,"name":"result_7","height":40,"fontSize":26,"color":"#ffffff","anchorY":0.5,"anchorX":0,"align":"left"}},{"type":"Label","props":{"y":111,"x":21,"width":200,"valign":"middle","text":"同花顺","strokeColor":"#2e034b","stroke":7,"name":"result_8","height":40,"fontSize":26,"color":"#ffffff","anchorY":0.5,"anchorX":0,"align":"left"}},{"type":"Label","props":{"y":76,"x":21,"width":200,"valign":"middle","text":"同花大顺","strokeColor":"#2e034b","stroke":7,"name":"result_9","height":40,"fontSize":26,"color":"#ffffff","anchorY":0.5,"anchorX":0,"align":"left"}},{"type":"Image","props":{"y":22.00000000000004,"x":27.000000000000078,"skin":"assets/ui.table/lucky5Title.png","name":"result_10"}}]},{"type":"Box","props":{"y":557,"x":721,"width":1440,"var":"boxMiddle","height":324,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":162,"x":166,"width":248,"skin":"assets/ui.table/poker.png","pivotY":165,"pivotX":127,"name":"poker1","height":324}},{"type":"Image","props":{"y":162,"x":439,"width":248,"skin":"assets/ui.table/poker.png","pivotY":165,"pivotX":127,"name":"poker2","height":324}},{"type":"Image","props":{"y":162,"x":720,"skin":"assets/ui.table/poker.png","pivotY":165,"pivotX":127,"name":"poker3"}},{"type":"Image","props":{"y":162,"x":994,"skin":"assets/ui.table/poker.png","pivotY":165,"pivotX":127,"name":"poker4"}},{"type":"Image","props":{"y":162,"x":1276,"skin":"assets/ui.table/poker.png","pivotY":165,"pivotX":127,"name":"poker5"}}]},{"type":"Box","props":{"y":782,"x":0,"width":1440,"var":"boxBottom","left":0,"height":120,"bottom":-2},"child":[{"type":"Image","props":{"skin":"assets/ui.table/bottom.png","right":0,"name":"bottom","bottom":0}},{"type":"Image","props":{"y":1,"x":242.9999999999999,"skin":"assets/ui.table/Bg6.png"}},{"type":"Image","props":{"y":-49,"x":522,"skin":"assets/ui.table/Bg5.png"}},{"type":"Image","props":{"y":12,"x":340,"skin":"assets/ui.table/account.png","name":"account"}},{"type":"Button","props":{"y":-31,"x":541,"var":"buttonStake","stateNum":"1","skin":"assets/ui.table/button_stake.png"},"child":[{"type":"Image","props":{"y":5.999999999999886,"x":121.00000000000011,"skin":"assets/ui.table/stakeTitle.png","name":"bg_bet_text"}}]},{"type":"Button","props":{"y":-32,"x":1205,"var":"buttonDeal","toggle":false,"stateNum":"2","skin":"assets/ui.table/btn_Bg2.png","labelBold":false},"child":[{"type":"Image","props":{"y":32,"x":42,"skin":"assets/ui.table/deal.png"}}]},{"type":"Button","props":{"y":-32,"x":1205,"var":"buttonDraw","stateNum":"2","skin":"assets/ui.table/btn_Bg2.png"},"child":[{"type":"Image","props":{"y":32,"x":42,"skin":"assets/ui.table/draw.png"}}]},{"type":"Button","props":{"y":1,"x":7.9999999999999245,"var":"buttonHelp","stateNum":"2","skin":"assets/ui.table/btn_Bg.png"},"child":[{"type":"Image","props":{"y":26,"x":32,"skin":"assets/ui.table/help.png"}}]},{"type":"Button","props":{"y":1,"x":125,"var":"buttonMusic","stateNum":"2","skin":"assets/ui.table/btn_Bg.png"},"child":[{"type":"Image","props":{"y":26,"x":20,"skin":"assets/ui.table/sound.png"}}]},{"type":"Button","props":{"y":36,"x":818,"var":"btnStakeAdd","stateNum":"2","skin":"assets/ui.table/btn_Bg3.png"},"child":[{"type":"Image","props":{"y":8.999999999999886,"x":15,"skin":"assets/ui.table/stakeAdd.png"}}]},{"type":"Button","props":{"y":36,"x":553.9999999999998,"var":"btnStakeCut","stateNum":"2","skin":"assets/ui.table/btn_Bg3.png"},"child":[{"type":"Image","props":{"y":23.000000000000114,"x":14,"skin":"assets/ui.table/stakeCut.png"}}]},{"type":"Label","props":{"y":74,"x":376,"width":250,"var":"textBalance","valign":"middle","stroke":2,"name":"balance","italic":false,"height":40,"fontSize":38,"font":"gray_small","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":68,"x":717,"width":140,"var":"textBetAmount","valign":"middle","name":"betAmount","height":40,"fontSize":38,"font":"gray_big","color":"#ffffff","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}}]}]};}
		]);
		return TableViewUI;
	})(View);