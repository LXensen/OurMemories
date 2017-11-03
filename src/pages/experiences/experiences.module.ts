import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExperiencesPage } from './experiences';

@NgModule({
  declarations: [
    ExperiencesPage,
  ],
  imports: [
    IonicPageModule.forChild(ExperiencesPage),
  ],
})
export class ExperiencesPageModule {}
