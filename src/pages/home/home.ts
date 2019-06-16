import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ProfilePage} from "../profile/profile";
import {SettingsPage} from "../settings/settings";
import {GamePage} from "../game/game";
import { HttpClient } from '@angular/common/http';
import {SaveProvider} from "../../providers/save";
import {putTabBar} from "../../model/tool";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  ionViewDidEnter(){
    this.save.loadProfile();
    putTabBar();
  }
  constructor(public navCtrl: NavController,public http: HttpClient, public save:SaveProvider){

    let currentDate=new Date();
    if(currentDate.getDay() > save.date.getDay()){
      save.player.keys=5;
      save.saveDate();
      save.saveProfile();
    }
  }
  profile(){
    this.navCtrl.push(ProfilePage);
  }
  setting(){
    this.navCtrl.push(SettingsPage);
  }
  play(){
    this.navCtrl.push(GamePage);
  }
}
