import { Memory } from './../models/memory-model';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { DBRefs } from './../environments/config';

@Injectable()
export class MemoryService {
    private EventMemories: FirebaseListObservable<any[]>;

    constructor(private afDB: AngularFireDatabase) {
     }

     // FROM YOUTUBE VIDEO https://www.youtube.com/watch?v=65Us8NwmYf4
    getEventMemories(experienceID: string) : FirebaseListObservable<any[]> {
        this.EventMemories = this.afDB.list(DBRefs.MEMORIES + '/' + experienceID)
        return this.EventMemories
    }

    getMemory(filename: string) {
        return this.afDB.app.storage().ref().child(`images/${filename}`).getDownloadURL()
    }

    addMemory(Memory: Memory){
        this.EventMemories.push(Memory).catch((err) => console.log(err.message));
    }
}