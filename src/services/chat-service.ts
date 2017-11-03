import { Message } from './../models/message-model';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { DBRefs } from './../environments/config';

@Injectable()
export class ChatService {
    private chats: FirebaseListObservable<any[]>;

    constructor(private afDB: AngularFireDatabase) {
     }

    getChat(experienceID: string) : FirebaseListObservable<any[]> {
        this.chats = this.afDB.list(DBRefs.CHATS + '/' + experienceID)
        return this.chats
    }

    sendMessage(message: Message) {
        return this.chats.push(message);
    }

}