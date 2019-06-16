import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Profile} from "../model/profile";
import {AlertController} from "ionic-angular";
import {NativeStorage} from "@ionic-native/native-storage";
@Injectable()
export class SaveProvider {
  player : Profile;
  musicOn : boolean;
  soundOn : boolean;
  addOn : boolean;
  unlockedAvatar : String[];
  date : Date;

  constructor(public http: HttpClient, public alertCtrl: AlertController, private nativeStorage: NativeStorage) {
    this.player=new Profile();
    this.unlockedAvatar=new Array<String>();
    this.loadProfile();
    if(this.player.name == null){
      this.loadProfile();
    }
    this.loadSetting();
    if(this.musicOn == null){
      this.loadSetting();
    }
    this.loadAvatar();
    if(this.unlockedAvatar == null){
      this.loadAvatar();
    }
    this.loadDate();
    if(this.date== null){
      this.date=new Date();
    }
  }
  loadDate(){
    this.nativeStorage.getItem('date')
      .then(
        data => {
          this.date=JSON.parse(data.date);
        },
        error =>
          this.nativeStorage.setItem('date', {date : JSON.stringify(new Date())})
            .then(
              () => console.log('Stored item!'),
              error => console.error('Error storing item', error)
            )
      );
  }
  saveDate(){
    this.nativeStorage.setItem('date', {date : JSON.stringify(new Date())})
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      )
  }
  loadProfile(){
    this.nativeStorage.getItem('userProfile')
      .then(
        data => {
          this.player.name=data.name;
          this.player.keys=data.keys;
          this.player.gems=data.gems;
          this.player.currentAvatar=data.currentAvatar;
        },
        //if there is no profile, use the default profile
        error =>
          this.nativeStorage.setItem('userProfile', {name: 'Default Player', keys: 5,gems : 20,currentAvatar : "assets/avatar/ghost.png"})
            .then(
              () => console.log('Stored item!'),
              error => console.error('Error storing item', error)
            )
      );
  }
  saveProfile(){
    this.nativeStorage.setItem('userProfile', {name: this.player.name, keys: this.player.keys,gems : this.player.gems,currentAvatar : this.player.currentAvatar})
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      )
  }

  loadSetting(){
    this.nativeStorage.getItem('settings')
      .then(
        data => {
          this.addOn=data.addOn;
          this.soundOn=data.soundOn;
          this.musicOn=data.musicOn;
        },
        error =>
          this.nativeStorage.setItem('settings', {addOn: 'true', soundOn: 'true',musicOn : 'false'})
            .then(
              () => console.log('Stored item!'),
              error => console.error('Error storing item', error)
            )
      );
  }
  saveSetting(){
    this.nativeStorage.setItem('settings', {addOn: this.addOn, soundOn: this.soundOn,musicOn : this.musicOn})
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      )
  }
  loadAvatar(){
    this.nativeStorage.getItem('unlockedAvatar')
      .then(
        data => {
          this.unlockedAvatar=JSON.parse(data.unlockedAvatar);
        },
        error =>
          this.nativeStorage.setItem('unlockedAvatar', {unlockedAvatar : 'assets/avatar/ghost.png'})
            .then(
              () => console.log('Stored item!'),
              error => console.error('Error storing item', error)
            )
      );
  }
  saveAvatar(){
    this.nativeStorage.setItem('unlockedAvatar', {unlockedAvatar : JSON.stringify(this.unlockedAvatar)})
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      )
  }
  deleteAll() {
    this.nativeStorage.clear();
    this.loadProfile();
    this.loadAvatar();
  }
  purchase(cost:number) {
    let confirm = this.alertCtrl.create({
      title: 'Confirm this purchase',
      message: 'Do you really want to buy it ? it will cost '+ cost+' gems',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            confirm.dismiss('no');
            return false;
          }
        },
        {
          text: 'Agree',
          handler: () => {
            if(this.player.gems >= cost){
              this.player.gems -= Math.round(cost);
              confirm.dismiss('yes');
            }
            else{
              confirm.dismiss('error');

            }
            return false;
          }
        }
      ]
    });
   return confirm;
  }
}
