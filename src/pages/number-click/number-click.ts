import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Observable} from "rxjs";
import {putTabBar, removeTabBar, wait} from "../../model/tool";
import {SaveProvider} from "../../providers/save";
declare let Phaser;
let that; //Used to call the class attributes
@IonicPage()
@Component({
  selector: 'page-number-click',
  templateUrl: 'number-click.html',
})
export class NumberClickPage {
  private score;
  private timer;
  private jump;
  private canLeave;
  constructor(public navCtrl: NavController, public navParams: NavParams, public save: SaveProvider,public alertCtrl: AlertController) {
    this.timer=navParams.get("timeLimit");
    that=this;
  }
  ionViewCanLeave(): boolean{
    return this.canLeave;
  }
  ionViewWillEnter(){
    removeTabBar();
    this.score=0;
    this.jump=false;
    this.canLeave=false;
    this.buildPhaserRenderer();
  }
  ionViewDidEnter() {
    const source = Observable
          .interval(1000)
          .timeInterval()
          .take(this.navParams.get("timeLimit"));
        source.subscribe(val=>{
            this.timer--;},
          (error)=>{
            console.log(error);
          },
          () =>  {
            let gemsEarned=Math.round((this.score/12)*100)/100;
            const endGame = this.alertCtrl.create({
              subTitle: "Time finish your score is " + this.score+ ". You earn " +gemsEarned +" Gems.",
              buttons: [{
               text: 'OK',
              }],
              enableBackdropDismiss :false,
            });
            endGame.present();
            endGame.onDidDismiss(()=>{
              this.canLeave=true;
              this.save.player.gems+=gemsEarned;
              this.save.saveProfile();
              putTabBar();
              this.navCtrl.pop();
            })
          }
        );
  }

  buttonTap(){
    this.jump=true;
    this.score++;
  }

  private buildPhaserRenderer() {
    let game = new Phaser.Game(window.innerWidth , window.innerHeight/1.8 , Phaser.CANVAS, 'game', { preload: preload, create: create, update: update },);
    let player=null;

    function preload() {
      game.load.image('sky', 'assets/imgs/sky.png');
      game.load.image('player','assets/imgs/unicorn.png' );
      if(that.save.musicOn){
        game.load.audio('music','assets/sounds/Dream about space.ogg');
      }

      game.load.audio('jump','assets/sounds/jump_01.wav');
    }

    function create() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      let sky=game.add.sprite(0, 0, 'sky');
      if(that.save.musicOn){
        let music = game.add.audio('music');
        music.play();
      }
      sky.height = game.height;
      sky.width = game.width;
      player = game.add.sprite(window.innerWidth/2.5,0, 'player');
      game.physics.arcade.enable(player);
      player.body.gravity.y = 1000;
      player.body.collideWorldBounds = true;
    }

    function update() {
      if (that.jump==true){
        if(that.save.soundOn){
          let sound = game.add.audio('jump');
          sound.play();
        }
        player.body.bounce.y = 0.2*window.devicePixelRatio;
        player.body.velocity.y = -180;
      }
      that.jump=false;
    }


  }
}
