import { ExperiencesPage } from './../experiences/experiences';
import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators }  from '@angular/forms';

import { AuthService } from './../../services/auth-service';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  SignUpForm: FormGroup;
  passwordsMatch: boolean = true;

  constructor(private navCtrl: NavController, 
              private authService: AuthService,
              private loadginCtrl: LoadingController,
              private alertCtrl: AlertController,
              private signUpFB: FormBuilder) {

              this.initializeForm();
  }

  initializeForm(){
    this.SignUpForm = this.signUpFB.group({
      userName: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      password2: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  onSignUp(){ 
    if(this.SignUpForm.value.password !== this.SignUpForm.value.password2){
      this.SignUpForm.setErrors(new Error('an error occured'));
      this.passwordsMatch = false;
      return;
    }

    const loading = this.loadginCtrl.create({ 
      content: 'Stand by....signing you up!'
    });

    loading.present();

    this.authService.signUpUser(this.SignUpForm.value.email, this.SignUpForm.value.password)
      .then(user => {
        this.authService.createApplicationUser(this.SignUpForm.value.userName, this.SignUpForm.value.email, user.uid)
      })
      .then(() => {
        loading.dismiss();
        const success = this.alertCtrl.create({
          title: 'Success!',
          subTitle: 'Let\'s get started!',
          buttons:[{
            text: 'Ok',
            handler: () => {
              this.navCtrl.setRoot(ExperiencesPage);
            }
          }]
        });
        success.present();
      })
      .catch(error => { 
        console.log('sign up')
         loading.dismiss();
         const err = this.alertCtrl.create({
           title: 'Hmmm...',
           subTitle: 'Something went wrong: ' + error.message,
           buttons: ['Ok']
         });
         err.present();
        console.log(error)
      });
  }
}
