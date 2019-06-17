import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import * as Gamelist from "../../model/gameList";
import {ProfilePage} from "../profile/profile";
import {SaveProvider} from "../../providers/save";
/**
 * Generated class for the GamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {
  private gamelist: Gamelist.Game[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public save: SaveProvider,public alertCtrl: AlertController) {
    this.gamelist=Gamelist.GAMESLIST;
  }

  playGame(name,timeLimit){
    if(this.save.player.keys > 0){
      this.save.player.keys--;
      this.save.saveProfile();
      this.navCtrl.push(name,{timeLimit :timeLimit});
    }
    else{
      const alert = this.alertCtrl.create({
        message: 'You don\'t have enough keys to do that. Try again later.',
        buttons: ['OK']
      });
      alert.present();
    }

  }
  profile(){
    this.navCtrl.push(ProfilePage);
  }s

}
