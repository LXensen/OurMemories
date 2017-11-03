import { Person } from './../../models/person-model';
import { Message } from './../../models/message-model';
import { ChatService } from './../../services/chat-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Experience } from './../../models/experience-model';
import { AuthService } from './../../services/auth-service';
import { FirebaseListObservable } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  messageContent: string;
  currentExperience: Experience;
  
  public chats$: FirebaseListObservable<any[]>;

  person: Person;

  constructor(public navCtrl: NavController, 
              private navParams: NavParams,
              private chatSVC: ChatService,
              private authService: AuthService) {
  }

  send(){
    let newMessage = new Message(this.authService.getUser().uid, this.messageContent, this.person.avatar)
    this.chatSVC.sendMessage(newMessage);
    this.messageContent='';
  }

  ionViewCanEnter(): boolean {
    return this.authService.getUser() === null ? false : true;
  }

  ionViewDidLoad() {
    this.authService.getApplicationUser(this.authService.getUser().uid)
    .subscribe((user) => {
      this.person = user;
      this.person.ID = this.authService.getUser().uid;
    });

    this.chats$ = this.chatSVC.getChat(this.currentExperience.experienceId)
  }

  ngOnInit() {
    this.currentExperience = this.navParams.get('experience');
  }
}
