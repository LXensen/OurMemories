import { ExperienceService } from './../../services/experience-service';
import { MemoryPage } from './../memory/memory';
import { AuthService } from './../../services/auth-service';
import { Memory } from './../../models/memory-model';
import { MemoryService } from './../../services/memory-service';
import { Experience } from './../../models/experience-model';
import { ImageService } from './../../services/image-service';
import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { IonicPage, NavParams, LoadingController, ActionSheetController, ModalController, NavController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';


@IonicPage()
@Component({
  selector: 'page-experience',
  templateUrl: 'experience.html',
})
export class ExperiencePage implements OnInit {
  currentExperience: Experience;
  public eventMemories: FirebaseListObservable<any[]>;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private camera: Camera,
    private imgService: ImageService,
    private imagePicker: ImagePicker,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private memoryService: MemoryService,
    private experienceService: ExperienceService,
    private authService: AuthService) {

  }

  selectMemory(memory: Memory) {
    let memoryModal = this.modalCtrl.create(MemoryPage, { memory: memory },{enableBackdropDismiss: true});

    memoryModal.present();
  }

  public imageSourceActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.openGallery();
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.launchCamera();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  private showLoading(message: string) {
    const loading = this.loadingCtrl.create({
      content: message
    });
    loading.present();

    return loading;
  }

  addNewMemory(result) {
    let newMemory = new Memory(result.filename + '.jpg',
                                this.authService.getUser().uid,
                                this.currentExperience.experienceId,
                                result.URL
    )

    this.memoryService.addMemory(newMemory)

    if(this.currentExperience.folderPic === ''){
      this.addFolderPic(result.URL);
    }
  }

  private addFolderPic(imageURL: string){
    console.log('URL is ' + imageURL);
    this.experienceService.addFolderPic(imageURL, this.currentExperience.experienceId);
  }

  launchCamera() {
    console.log('attempt to lauch camera...')
    const cameraOptions: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    };

    let loader = this.showLoading('uploading your image...');

    this.camera.getPicture(cameraOptions)
      .then((imagePath) => {
        return this.imgService.convertURIToBlob(imagePath);
      })
      .then((imageBlob) => {
        console.log('got blob ' + imageBlob);
        
        let newRefPath = `memories/${this.currentExperience.experienceId}/${this.authService.getUser().uid}`;
        
        console.log(newRefPath)

        return this.imgService.uploadToFirebase(imageBlob, newRefPath);
      })
      .then((result) => {
        this.addNewMemory(result)

        loader.dismiss();
      })
      .catch((err) => {
        console.log(err);
        loader.dismiss();
      });
  }

  private openGallery(): void {
    let options = {
      maximumImagesCount: 5,
      width: 500,
      height: 500,
      quality: 100
    }

    this.imagePicker.getPictures(options)
      .then((results) => {
        for (var i = 0; i < results.length; i++) {

          this.imgService.convertURIToBlob(results[i])
            .then((imageBlob) => {
              console.log('got something from conversion process...');
              let newRefPath = `memories/${this.currentExperience.experienceId}/${this.authService.getUser().uid}`;
              console.log(newRefPath)
              return this.imgService.uploadToFirebase(imageBlob, newRefPath)
            })
            .then((result) => {
              console.log('got a memory')
              this.addNewMemory(result)
            })
        }
      })
      .catch(error => console.log(error));
  }

// PAGE EVENTS //
  ionViewCanEnter(): boolean {
    return this.authService.getUser() === null ? false : true;
  }

  ionViewDidLoad() {
    this.eventMemories = this.memoryService.getEventMemories(this.currentExperience.experienceId);
    // FROM YOUTUBE VIDEO https://www.youtube.com/watch?v=65Us8NwmYf4
    //******************************************************************************************************************
    // The | async autimatically calls 'subscribe' under the hood.  So you can assing the service call to your variable.
    // It will also get destroyed
    //******************************************************************************************************************
    // this.memoryService.getEventMemories(this.currentExperience.experienceId)
    //   .subscribe(
    //   (memories) => {
    //     //debugger;
    //     this.eventMemories = memories
    //   })
  }

  ngOnInit() {
    this.currentExperience = this.navParams.get('experience');
  }
}