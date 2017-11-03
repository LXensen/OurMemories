import { SearchContactService } from './../services/search-contact-service';
import { SearchcontactsmodalPage } from './../pages/searchcontactsmodal/searchcontactsmodal';
import { ExperiencesPage } from './../pages/experiences/experiences';
import { ChatService } from './../services/chat-service';
import { ChatPage } from './../pages/chat/chat';
import { InvitationService } from './../services/invitation-service';
import { MemoryPage } from './../pages/memory/memory';
import { DBCOnfig } from './../environments/db-config';
import { MemoryService } from './../services/memory-service';
import { ImageService } from './../services/image-service';
import { ExperiencePage } from './../pages/experience/experience';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ExperienceService } from './../services/experience-service';
import { AuthService } from './../services/auth-service';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { Transfer } from '@ionic-native/transfer';
import { PhotoLibrary } from '@ionic-native/photo-library';

@NgModule({
  declarations: [
     MyApp,
     MemoryPage,
     ExperiencePage,
     ChatPage,
     SearchcontactsmodalPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireModule.initializeApp(DBCOnfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
     MyApp,
     MemoryPage,
     ExperiencePage,
     ChatPage,
     SearchcontactsmodalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Transfer,
    ImagePicker, 
    AuthService,
    ChatService,
    SearchContactService,
    MemoryService,
    ExperienceService,
    ImageService,
    InvitationService,
    AngularFireAuthModule,
    PhotoLibrary,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
