import { SearchcontactsmodalPage } from './../searchcontactsmodal/searchcontactsmodal';
import { ChatPage } from './../chat/chat';
import { FirebaseListObservable } from 'angularfire2/database';
import { Invitation } from './../../models/invitation-model';
import { InvitationService } from './../../services/invitation-service';
import { Experience } from './../../models/experience-model';
import { AuthService } from './../../services/auth-service';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, Platform, ToastController, ModalController } from 'ionic-angular';
import { ExperienceService } from './../../services/experience-service';
import { ExperiencePage } from './../experience/experience';

import { Subscription } from "rxjs/Subscription";

import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-experiences',
  templateUrl: 'experiences.html',
})
export class ExperiencesPage implements OnDestroy {

  public experiences: Experience[] = [];
  isMobile: boolean = false;
  availableInvites: number = 0;
  hasBeenInvited: boolean = false;

  private experiencesSub: Subscription;
  //private inviteCountSub: Subscription;
  private canInviteSub: Subscription;
  private isInviting: boolean = false;
  
  constructor(private navCtrl: NavController,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private experienceService: ExperienceService,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private platform: Platform,
              private inviteService: InvitationService,
              private toastCtrl: ToastController) {

    this.isMobile = !platform.is('mobile');
  }

  ionViewDidEnter(){
    if(this.availableInvites > 0){
    const toast = this.toastCtrl.create({
      message: 'You have ' + this.availableInvites + ' invites. Click menu to view',
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: "top"
    });
    toast.present();
  }
  }

  ionViewDidLoad() {
    const loading = this.loadingCtrl.create({
      content: 'Loading your experiences...'
    });
    
    loading.present();

    this.experiencesSub = this.experienceService.getMyExperiences()
      .subscribe(
      (experiences) => {
        if (experiences) {
          this.experiences = experiences;
        }
        loading.dismiss();
      },
      error => {
        loading.dismiss();
        console.log(error);
      },
      () => { loading.dismiss(); }

      );
  }

  ionViewCanEnter(): boolean {
    return this.authService.getUser() === null ? false : true;

  }

  gotoExperience(experience: Experience) {
    this.navCtrl.push(ExperiencePage, { experience: experience });
  }

  showErrorToast(data: any) {
    let toast = this.toastCtrl.create({
      message: data,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  chat(experience: Experience){
    this.navCtrl.push(ChatPage, { experience: experience});
  }

  invite(experience: Experience){
    let alert = this.alertCtrl.create({
      title: 'Invite a friend',
      inputs: [
        {
          name: 'personemail',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            //console.log('cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            if(data.personemail===''){
              this.showErrorToast('Invalid email');
              return true;
            }
            
            let invite = new Invitation(data.personemail, experience.experienceId)

            this.isInviting = true;
            let invited = false;
            let canInviteSub = this.inviteService.canInvite(invite)
                              .subscribe((isInvited) => {
                                //console.log(isInvited.$value);
                                if(!invited){
                                  console.log('they have just been invited, do not show prompt');
                                  if(isInvited.$value){                                  
                                    let alreadyInvited = this.alertCtrl.create({
                                      title: 'Already a Member!',
                                      buttons:[{
                                        text:'Ok'
                                      }]
                                    });
                                    alreadyInvited.present();
                                  }else{      
                                   this.inviteService.invitePerson(invite)
                                   .then((token) => {
                                     invited = true;
                                   })
                                   .catch(
                                     error => console.log(error)
                                   )
                                 }
                                }
                              });
          }
        }
      ]
    });

    alert.present();
  }

  newExperience() {
    let modal = this.modalCtrl.create(SearchcontactsmodalPage);
  
    modal.onDidDismiss(data => {
      console.log(data);
    });
  
    modal.present();
    // let alert = this.alertCtrl.create({
    //   title: 'New Experience',
    //   inputs: [
    //     {
    //       name: 'experiencename',
    //       placeholder: 'Experience Name'
    //     },
    //     {
    //       name: 'experiencelocation',
    //       placeholder: 'Location'
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: data => {
    //         //console.log('cancel clicked');
    //       }
    //     },
    //     {
    //       text: 'Save',
    //       handler: data => {
    //         this.authService.getUser().getIdToken()
    //           .then(
    //           (token: string) => {
    //             this.experienceService.addExperience(new Experience(data.experiencename, this.authService.getToken(), '', data.experiencelocation));
    //           }
    //           )
    //           .catch(
    //           error => console.log(error)
    //           )
    //       }
    //     }
    //   ]
    // });

    // alert.present();
  }

  ngOnDestroy(){
    this.DestroySubsciptions();
  }

  private DestroySubsciptions() {
    this.experiencesSub.unsubscribe();
    
    if(this.isInviting) {
      this.canInviteSub.unsubscribe();
    }
    
   }
}
