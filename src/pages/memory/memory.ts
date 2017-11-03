import { Memory } from './../../models/memory-model';
import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';

import { PhotoLibrary } from '@ionic-native/photo-library';


@IonicPage()
@Component({
  selector: 'page-memory',
  templateUrl: 'memory.html'
})
export class MemoryPage {

  private selectedMemory: Memory;

  constructor(private navParams: NavParams,
              private loadginCtrl: LoadingController,
              private viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private photoLib: PhotoLibrary,
              ) {
    this.selectedMemory = this.navParams.get('memory');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemoryPage');
  }

  ngOnInit() {
  }

  downloadImage(){
    const saving = this.loadginCtrl.create({
      content: 'downloading....'
    });

    const success = this.alertCtrl.create({
      title: 'Save Image?',
      subTitle: 'Save image to your photo library?',
      buttons: [{
        text: 'Ok',
        handler: (data) => {
          saving.present();
          this.photoLib.requestAuthorization()
          .then(() => {
              this.photoLib.saveImage(this.selectedMemory.url,'OurMemories')
                .then((data) => {
                  saving.dismiss();
                  const okDownload = this.alertCtrl.create({
                    title: 'Image Downloaded',
                    buttons: [{
                      text:'Ok'
                    }]
                  });

                  okDownload.present();

                  console.log('data returned')
                })
                .catch((err) => console.log(err))

          })
        }
      },{
        text:'Cancel'
      }]
    });
    success.present();
  }

  dismissMe(){
    this.viewCtrl.dismiss();
  }
}
