
 var MessageDialog = (function(_super) {
     function MessageDialog(results) {
         MessageDialog.super(this);
         this._resultsInfo = results;
         this.init();
     }

     Laya.class(MessageDialog, "MessageDialog", _super);

     MessageDialog.prototype.init = function() {
         if (   this._resultsInfo.results == Papaya.PokerGo.Poker.NO_SHOOT          ||
                this._resultsInfo.results == Papaya.PokerGo.Poker.SEQUENCE          ||
                this._resultsInfo.results == Papaya.PokerGo.Poker.HIT_COLUMN        ||
                this._resultsInfo.results == Papaya.PokerGo.Poker.ONE_PAIR
         ){
            this._isWin = false;
             this.lostShow();
         }

         else if(   this._resultsInfo.results == Papaya.PokerGo.Poker.SHOOT             ||
                    this._resultsInfo.results == Papaya.PokerGo.Poker.STREIGHT          ||
                    this._resultsInfo.results == Papaya.PokerGo.Poker.STREIGHT_FLUSH    ||
                    this._resultsInfo.results == Papaya.PokerGo.Poker.THREE_OF_A_KIND
         ){
            this._isWin = true;
            this.winShow();
             
         }

         this.btnDouble.on(Laya.Event.CLICK,this,this.onClickDouble);
     };

     MessageDialog.prototype.lostShow = function (){
         this.light.visible = false;
         this.star.visible = false;

         this.winOrLost.skin = "assets/ui.reward/img_lost.png";
         this.imageJackPot.skin = "assets/ui.reward/lost.png";
         this.IconResurts.skin = "assets/ui.reward/results_" +this._resultsInfo.results+ ".png";

         this.resultScore.font = "lost";

         if(this._resultsInfo.score > 0){
             this.resultScore.text = 0;
         }
         else if(this._resultsInfo.score == 0){
             this.resultScore.text = "-" + (this._resultsInfo.betAmount + Papaya.PokerGo.Game.BET_AMOUNT[Papaya.PokerGo.MIN_BET_INDEX]);
         }
         else{
             this.resultScore.text = this._resultsInfo.score * 2 ;
         }

         this.btnDouble.visible = false ;
         this.btnClose.x = 720 ;
     };

     MessageDialog.prototype.winShow = function (){
         this.light.visible = true;
         this.star.visible = true;

         var rotate = RotateBy.create(6,360).repeatForever();
         App.actionManager.addAction(rotate,this.light);

         var show = Show.create();
         var hide = Hide.create();
         var time1 = DelayTime.create(0.480);
         var time2 = DelayTime.create(0.480);

         var seq = Sequence.create(show,time1,hide,time2).repeatForever();
         App.actionManager.addAction(seq,this.star);

         this.winOrLost.skin = "assets/ui.reward/img_win.png";
         this.imageJackPot.skin = "assets/ui.reward/win.png";

         this.resultScore.font = "win";
         this.resultScore.text = "+" + this._resultsInfo.score ;

         this.IconResurts.skin = "assets/ui.reward/results_" +this._resultsInfo.results+ ".png";

     };

     MessageDialog.prototype.openView = function (){
        var self = this;
        if (this._isWin){
            var soundName = (Math.floor(Math.random() * 2 ) ) ? "good_1" : "good_2";
            App.assetsManager.playSound(soundName);  
        }
        else {
            var soundName = (Math.floor(Math.random() * 2 ) ) ? "lost_1" : "lost_2";
            App.assetsManager.playSound(soundName);
        }
     };

     MessageDialog.prototype.onClickDouble = function() {
         console.log("open Double");
          App.uiManager.showDoubleView();
         this.close();
     };

     MessageDialog.prototype.close = function() {

     };

     return MessageDialog;
 }(MessageDialogUI));