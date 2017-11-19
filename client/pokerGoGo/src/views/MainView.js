/**
 * Created by WhelaJoy on 2017/3/11.
 */
var MainView = (function (_super){
	function MainView(){
		MainView.super(this);
		this.init();
	}
	Laya.class(MainView,"MainView",_super);

	MainView.prototype.init = function (){
		this.initEvent();
	};

	MainView.prototype.initEvent = function (){
		this.btnPlay.on(Laya.Event.CLICK,this,this.openGameView);
	};

	MainView.prototype.openGameView = function (){
		App.runGameView();
	};

	return MainView
})(MainViewUI);