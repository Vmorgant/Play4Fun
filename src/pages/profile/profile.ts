import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SaveProvider} from "../../providers/save";
import {Avatar, AVATARLIST} from "../../model/avatar";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  private avatarList: Avatar[];

  constructor(public navCtrl: NavController, public navParams: NavParams,public save: SaveProvider) {
    this.avatarList=AVATARLIST;
    this.save.unlockedAvatar.push("assets/avatar/ghost.png");
  }

  ionViewWillLeave(){
    this.save.saveProfile();
  }

  ionViewWillEnter(){
    this.save.loadAvatar();
  }
  setName(value: any) {
    this.save.player.name=value;
  }

  selectAvatar(image: string) {
    this.save.player.currentAvatar=image;
  }
  isUnlocked(name : string){
    return(this.save.unlockedAvatar.some(x=>x===name));
  }
  buyAvatar(avatar: Avatar) {
    let alert=this.save.purchase(avatar.cost);
    alert.present();
    alert.onDidDismiss((data: string) => {
      if(data.match("yes")){
        this.save.unlockedAvatar.push(avatar.image);
        this.save.saveAvatar();
      }
      else if(data.match("no")){
      }
      else{
        let error=this.save.alertCtrl.create({
          title :"Error you doesn't have enough gems to buy this come back later."
        });
        error.present();
      }
    });

  }
}
