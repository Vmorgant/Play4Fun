import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';

import {AboutPage} from '../pages/about/about';
import {HomePage} from '../pages/home/home';
import {GamePage} from '../pages/game/game';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HttpClientModule} from "@angular/common/http";
import {SaveProvider} from '../providers/save';
import {ProfilePage} from "../pages/profile/profile";
import {NativeStorage} from "@ionic-native/native-storage";
import {SettingsPage} from "../pages/settings/settings";
import {LocalNotifications} from "@ionic-native/local-notifications";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    HomePage,
    SettingsPage,
    ProfilePage,
    GamePage,
    TabsPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    HomePage,
    SettingsPage,
    ProfilePage,
    GamePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SaveProvider
  ]
})
export class AppModule {}
