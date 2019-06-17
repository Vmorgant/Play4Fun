import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {ProfilePage} from "../profile/profile";
import {SettingsPage} from "../settings/settings";
import {GamePage} from "../game/game";
import { HttpClient } from '@angular/common/http';
import {SaveProvider} from "../../providers/save";
import {putTabBar} from "../../model/tool";
import {AddProvider} from "../../providers/add";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,public http: HttpClient, public save:SaveProvider, public add:AddProvider,public alertCtrl: AlertController,){
    let currentDate=new Date();
    if(currentDate.getDay() > save.date.getDay()){
      save.player.keys=5;
      save.saveDate();
      save.saveProfile();
    }

  }
  ionViewWillEnter(){
    this.save.loadProfile();
    this.add.adMob.prepareRewardVideoAd({isTesting: true, autoShow:false, adId: "ca-app-pub-3940256099942544/5224354917"});
    putTabBar();
    if(this.save.addOn){
      this.add.showBanner();
    }
    else{
      this.add.hideBanner();
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

  addKeys() {
    let addKey=this.alertCtrl.create({
      title: 'Purchase keys',
      message: 'Do you want to watch and add to earn more keys ?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.add.showVideo();
            document.addEventListener('onAdPresent', val => this.rewardKeys());
            document.releaseEvents();
            this.add.adMob.prepareRewardVideoAd({isTesting: true, autoShow:false, adId: "ca-app-pub-3940256099942544/5224354917"});
          }
        },
        {
          text: 'No',
        }
      ]
    })
    addKey.present();
  }

  addGems() {
    let addGems=this.alertCtrl.create({
      title: 'Purchase gems',
      message: 'Do you want to watch and add to earn more gems ?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.add.showVideo();
            document.addEventListener('onAdPresent', val => this.rewardGems());
            document.releaseEvents();
            this.add.adMob.prepareRewardVideoAd({isTesting: true, autoShow:false, adId: "ca-app-pub-3940256099942544/5224354917"});
          }
        },
        {
          text: 'No',
        }
      ]
    });
    addGems.present();
  }

  rewardKeys() {
   this.save.player.keys++;
   this.save.saveProfile();
  }
  rewardGems() {
    this.save.player.gems+=20;
    this.save.saveProfile();
  }

  errorDisplay() {
    let error=this.alertCtrl.create({
      title: 'Error',
      message: 'An error as occured please try again later',
      buttons: [
        {
          text: 'Ok',
        },
      ]
    });
    error.present();
  }


}
