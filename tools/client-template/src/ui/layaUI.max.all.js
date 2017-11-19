var CLASS$=Laya.class;
var STATICATTR$=Laya.static;
var View=laya.ui.View;
var Dialog=laya.ui.Dialog;
var BoxMessageUI=(function(_super){
		function BoxMessageUI(){

		    this.textMessage=null;

			BoxMessageUI.__super.call(this);
		}

		CLASS$(BoxMessageUI,'ui.boxes.BoxMessageUI',_super);
		var __proto__=BoxMessageUI.prototype;
		__proto__.createChildren=function(){

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(BoxMessageUI.uiView);
		}

		STATICATTR$(BoxMessageUI,
		['uiView',function(){return this.uiView={"type":"View","props":{"width":800,"height":200},"child":[{"type":"Image","props":{"width":800,"top":0,"skin":"ui.table/message2.png","sizeGrid":"8,2,5,2","left":0,"height":200}},{"type":"Label","props":{"wordWrap":true,"width":800,"var":"textMessage","valign":"middle","text":"庄家赢了","height":200,"fontSize":80,"font":"Helvetica","color":"#ffffff","bold":true,"align":"center"}}]};}
		]);
		return BoxMessageUI;
	})(View);
var MessageDialogUI=(function(_super){
		function MessageDialogUI(){

		    this.btnDouble=null;
		    this.winOrLost=null;
		    this.imageJackPot=null;
		    this.labelScore=null;
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

		CLASS$(MessageDialogUI,'ui.dialogs.MessageDialogUI',_super);
		var __proto__=MessageDialogUI.prototype;
		__proto__.createChildren=function(){

			laya.ui.Component.prototype.createChildren.call(this);
			this.createView(MessageDialogUI.uiView);
		}

		STATICATTR$(MessageDialogUI,
		['uiView',function(){return this.uiView={"type":"Dialog","props":{"width":1440,"height":900,"anchorY":0,"anchorX":0},"child":[{"type":"Image","props":{"y":450,"x":720,"visible":true,"skin":"ui.table/Bg4.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":450,"x":720,"visible":true,"skin":"ui.table/Bg3.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":362,"x":722,"visible":true,"skin":"ui.table/Bg2.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":642,"x":722,"visible":true,"skin":"ui.table/Bg1.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":137,"x":722,"visible":true,"skin":"ui.table/congratulations.png","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":799,"x":887,"visible":true,"var":"btnDouble","stateNum":2,"skin":"ui.table/btn_double2.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":17.999999999999886,"x":46.99999999999977,"skin":"ui.table/gamblingSize.png"}}]},{"type":"Button","props":{"y":799,"x":576,"visible":true,"stateNum":2,"skin":"ui.table/btn_back2.png","name":"close","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":17.999999999999886,"x":71.99999999999989,"skin":"ui.table/continue.png"}}]},{"type":"Image","props":{"y":642,"x":726,"visible":true,"skin":"ui.table/blueBg2.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":362,"x":727,"var":"lucky5Bg","skin":"ui.table/element27.png","scaleY":1.3,"scaleX":1.3,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":576,"x":657,"visible":true,"var":"winOrLost","skin":"ui.table/massageView_Win.png"}},{"type":"Image","props":{"y":581,"x":596,"visible":false,"var":"imageJackPot","skin":"ui.table/jackPot2.png"}},{"type":"Label","props":{"y":675,"x":734,"width":400,"visible":true,"var":"labelScore","valign":"middle","text":90000,"fontSize":48,"font":"golden_orange","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"y":177,"x":462,"var":"element20","skin":"ui.table/element20.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element17","skin":"ui.table/element17.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element16","skin":"ui.table/element16.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element15","skin":"ui.table/element15.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element26","skin":"ui.table/element26.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element14","skin":"ui.table/element14.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element18","skin":"ui.table/element18.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element19","skin":"ui.table/element19.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element21","skin":"ui.table/element21.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element22","skin":"ui.table/element22.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element23","skin":"ui.table/element23.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":177,"x":462,"var":"element24","skin":"ui.table/element24.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":178,"x":462,"var":"element25","skin":"ui.table/element25.png","scaleY":1.3,"scaleX":1.3}},{"type":"Image","props":{"y":407,"x":851,"width":414,"var":"element3","skin":"ui.table/element3.png","scaleY":1.3,"scaleX":1.3,"pivotY":177.88013318534962,"pivotX":297.11986681465055,"height":290}},{"type":"Image","props":{"y":463,"x":568,"var":"element2","skin":"ui.table/element2.png","scaleY":1.3,"scaleX":1.3,"pivotY":220,"pivotX":75}}]};}
		]);
		return MessageDialogUI;
	})(Dialog);
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
		['uiView',function(){return this.uiView={"type":"View","props":{"width":1136,"height":640},"child":[{"type":"Image","props":{"y":0,"x":0,"width":1440,"var":"backgroud","skin":"ui.loader/bg.png","sizeGrid":"28,9,5,9","height":900}},{"type":"ProgressBar","props":{"y":686,"x":276,"var":"progress","skin":"ui.loader/progress.png","sizeGrid":"2,2,2,4"}},{"type":"Label","props":{"y":724,"x":734,"var":"percent","text":"100%","fontSize":32,"color":"#ffffff","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":670,"x":720,"wordWrap":false,"width":600,"var":"message","valign":"middle","text":"正在加载......","height":40,"fontSize":38,"color":"#ffffff","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}}]};}
		]);
		return LoaderViewUI;
	})(View);