import { ExperiencesPage } from './../experiences/experiences';
import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators }  from '@angular/forms';
import { AuthService } from './../../services/auth-service';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  SignInForm: FormGroup;
  private amRedirecting = false;

  constructor(private navCtrl: NavController, 
              private authService: AuthService,
              private loadginCtrl: LoadingController,
              private alertCtrl: AlertController,
              private signUpFB: FormBuilder) {
                
                this.initializeForm();
  }

  initializeForm(){
    this.SignInForm = this.signUpFB.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    })
  }

  ionViewDidLoad() {
    //console.log(this.navParams.data)
  }

  onSignIn(){
    
    const loading = this.loadginCtrl.create({
      content: 'Stand by....signing you in!'
    });
    if(this.amRedirecting){
      return true;
    }
    loading.present();

    this.authService.signInUser(this.SignInForm.value.email, this.SignInForm.value.password)
      .then(data => {
        const welcome = this.alertCtrl.create({
          title: 'Hey!',
          subTitle: 'Welcome back!',
          buttons:[{
            text: 'Ok',
            handler: () => {
                this.navCtrl.setRoot(ExperiencesPage);             
            }
          }]
        });
        welcome.present();
        loading.dismiss();
      })
      .catch(error => { 
        
        loading.dismiss();
        const err = this.alertCtrl.create({
          title: 'Hmmm...',
          subTitle: 'Something went wrong: ' + error.message,
          buttons: ['Ok']
        });
        err.present();
        console.log(error)
      });;
  }

  goToSignUpPage(){
    this.amRedirecting = true;
    console.log('redirect to Sign Up')
    this.navCtrl.setRoot('SignupPage');; 
  }
}
