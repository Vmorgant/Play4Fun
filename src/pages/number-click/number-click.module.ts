import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NumberClickPage } from './number-click';

@NgModule({
  declarations: [
    NumberClickPage,
  ],
  imports: [
    IonicPageModule.forChild(NumberClickPage),
  ],
})
export class NumberClickPageModule {}
