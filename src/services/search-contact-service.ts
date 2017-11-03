import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class SearchContactService {
    
    constructor(private afDB: AngularFireDatabase) { }


    //return this.afDB.database.ref().child(DBRefs.PERSON).orderByChild('email').equalTo(invite.personId).once('value')
    getContacts(start, end, user) : FirebaseListObservable<any>{
        console.log(user);
        //debugger;

        //return this.afDB.list('/PersonContacts/' + user);
        return this.afDB.list('/PersonContacts/', {
            query: {
                orderByChild: 'email',
                limitToFirst: 10,
                startAt: start,
                endAt: end
            }
        });
    }
}