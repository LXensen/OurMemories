import { AuthService } from './../services/auth-service';
import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController, Platform, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InvitationService } from './../services/invitation-service';
import { Subscription } from "rxjs/Subscription";

import * as firebase from 'firebase/app';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  @ViewChild('content') nav: NavController;

    
  availableInvites: number = 0;
  isMobile: boolean = false;
  isAuthenticated: boolean = false;
  private inviteCountSub: Subscription;

  constructor(
              platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private menu: MenuController,
              private alertCtrl: AlertController,
              private authService: AuthService,
              private inviteService: InvitationService) {


        firebase.auth().onAuthStateChanged((user) => {
          if(user){        
            this.isAuthenticated = true;

            this.inviteCountSub = this.inviteService.getNumberOfOutstandingInvites()
            .subscribe((count) => {
              this.availableInvites = count.length > 0 ? count.length : 0;
              this.nav.setRoot('ExperiencesPage');
            });
          }else{
            this.isAuthenticated = false;
            this.nav.setRoot('SigninPage')
          }
        });
        
        this.isMobile = !platform.is('mobile');
        
        platform.ready().then(() => {
          statusBar.styleDefault();
          splashScreen.hide();
        });
  }

  logout(){
    const success = this.alertCtrl.create({
      title: 'Leaving?',
      subTitle: 'Are you sure you want to log out?',
      buttons: [{
        text: 'Ok',
        handler: (data) => {
          this.inviteCountSub.unsubscribe();
          this.authService.signOutUser()
            .then(data => {
                
            })
            .catch(error => console.log(error)
          )
        }
      },{
        text:'Cancel'
      }]
    });
    success.present();
  }

  ionViewDidLoad() {
console.log('app.component view did load');
  }

  // initItems() {
  //   this.albums = [
  //     {
  //       name: 'Website Design & Development',
  //       icon: 'construct',
  //       link: 'Services'
  //     },
  //     {
  //       name: 'Content Management',
  //       icon: 'folder-open',
  //       link: 'Services'
  //     },
  //     {
  //       name: 'iOS Apps',
  //       icon: 'logo-apple',
  //       link: 'Services'
  //     },
  //     {
  //       name: 'Android Apps',
  //       icon: 'logo-android',
  //       link: 'Services'
  //     },
  //     {
  //       name: 'Window Apps',
  //       icon: 'logo-windows',
  //       link: 'Services'
  //     },
  //   ];

  //   this.contacts = [
  //     {
  //       name: 'Our Projects',
  //       icon: 'cube',
  //       link: 'Projects'
  //     },
  //     {
  //       name: 'Our Story',
  //       icon: 'archive',
  //       link: 'About'
  //     },
  //     {
  //       name: 'Our Team',
  //       icon: 'people',
  //       link: 'About'
  //     }
  //   ];
  // }


  gotToInvites(){
    this.nav.push('InvitesPage');
    this.menu.close();
  }

  navigateTo(page: string): void {
    let navigateTo: string = '';

    switch (page) {
      case 'Experiences':
        navigateTo = 'ExperiencesPage';
        //this.nav.setRoot(ExperiencesPage)
        break;
      case 'Contacts':
      
      navigateTo = 'ContactsPage';
        
        break;
      case 'SignIn':
        navigateTo = 'SigninPage';
      case 'Invites':
        navigateTo = 'InvitesPage'
    }

    this.nav.setRoot(navigateTo);
    this.menu.close();
  }
}

