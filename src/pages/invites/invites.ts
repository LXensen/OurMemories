import { Invitation } from './../../models/invitation-model';
import { InvitationService } from './../../services/invitation-service';
import { AuthService } from './../../services/auth-service';
import { Component } from '@angular/core';
import { IonicPage, LoadingController, AlertController, Platform, NavController } from 'ionic-angular';

import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-invites',
  templateUrl: 'invites.html',
})
export class InvitesPage {

  public invitations: Observable<any[]>;

  isMobile: boolean = false;

  constructor(private navCtrl: NavController,
              private authService: AuthService,              
              private alertCtrl: AlertController,
              private invitesService: InvitationService,
              private platform: Platform,) {

                this.isMobile = platform.is('mobile');
  }

  ionViewDidLoad() {
    this.invitations = this.invitesService.listInvites()
  }

  acceptInvite(invite: Invitation){
    this.invitesService.acceptInvitation(invite)
    .then(data => {
      const welcome = this.alertCtrl.create({
        title: 'Invite Accepted!',
        subTitle: 'Now you can share your pictures at this event!',
        buttons:[{
          text: 'Ok',
          handler: () => {
              //this.navCtrl.setRoot('ExperiencesPage');            
          }
        }]
      });
      welcome.present();
    })
    .catch(error => { 
      const err = this.alertCtrl.create({
        title: 'Hmmm...',
        subTitle: 'Something went wrong: ' + error.message,
        buttons: ['Ok']
      });
      err.present();
      console.log(error)
    });;
  }

  declineInvite(){

  }

  ionViewCanEnter(): boolean {
    return this.authService.getUser() === null ? false : true;
  }
}
