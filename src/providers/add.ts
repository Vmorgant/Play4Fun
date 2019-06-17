import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AdMobOptions, AdMobPro} from "@ionic-native/admob-pro";
import {SaveProvider} from "./save";
@Injectable()
export class AddProvider {
  constructor(public http: HttpClient, public adMob: AdMobPro, public save:SaveProvider){
    let bannerConfig: AdMobOptions= {
      isTesting: true,
      adId: "ca-app-pub-3940256099942544/6300978111",
      adSize : "FULL_BANNER",
    };

    this.adMob.createBanner(bannerConfig);

  }
  showBanner(){
    this.adMob.showBanner(this.adMob.AD_POSITION.BOTTOM_CENTER);

  }
  hideBanner(){
    this.adMob.hideBanner();
  }
  showVideo(){
    this.adMob.showRewardVideoAd();
  }

}
