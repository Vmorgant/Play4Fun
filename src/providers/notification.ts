import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {LocalNotifications} from "@ionic-native/local-notifications";
@Injectable()
export class NotificationProvider {

  constructor(public http: HttpClient, private localNotifications: LocalNotifications) {
    this.localNotifications.schedule([
      {
        id : 1,
        text: 'Your keys has been refilled, it \'s ,time to play',
        trigger: {
          count : 1,
          every: { hour: 0}
        },
      },
    ]
    );
  }

}
