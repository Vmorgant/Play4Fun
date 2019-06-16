import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnimalMatchPage } from './animal-match';

@NgModule({
  declarations: [
    AnimalMatchPage,
  ],
  imports: [
    IonicPageModule.forChild(AnimalMatchPage),
  ],
})
export class AnimalMatchPageModule {}
