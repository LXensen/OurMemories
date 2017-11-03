import { Observable } from 'rxjs';
import { Invitation } from './../models/invitation-model';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { DBRefs } from './../environments/config';

import 'rxjs/add/operator/map';

@Injectable()
export class InvitationService {

   //private invites: FirebaseListObservable<any>;
   private invitations: Observable<Invitation[]>;
   private hasBeenInvited: Observable<any>;

   constructor(private afDB: AngularFireDatabase,
                private authService: AuthService) { }

    canInvite(invite: Invitation){
                this.hasBeenInvited = this.afDB.list(DBRefs.PERSON,{
                    query: {
                        orderByChild: 'email',
                        equalTo: invite.personId,                     
                        limitToFirst: 1
                    }
                })
                .switchMap((person) => {
                    if(person.length > 0){
                        var path = DBRefs.PERSONSEXPERIENCES + '/' + person[0].$key + '/' + invite.experienceId;
                        return this.afDB.object(path);
                    }
                })

                return this.hasBeenInvited
                //this.hasBeenInvited.subscribe(val => {console.log('value is'); console.log(val.$value)})
    }

    acceptInvitation(invite: Invitation){
        let userID = this.authService.getUser().uid
        var updates ={};
        updates['/' + DBRefs.PERSONINVITES + '/' + userID + '/' + invite.experienceId] = null;
        updates['/' + DBRefs.EXPERIENCES + '/' + invite.experienceId + '/InvitedPeople/' + this.authService.getUser().uid] = 'true';
        updates['/' + DBRefs.PERSONSEXPERIENCES + '/' + userID + '/' + invite.experienceId] = true;

        return this.afDB.database.ref().update(updates);
    }

    invitePerson(invite: Invitation){
        return this.afDB.database.ref().child(DBRefs.PERSON).orderByChild('email').equalTo(invite.personId).once('value')
                .then((data) => {
                    if(data.val()){
                        //console.log('Invite Person method: ' + Object.keys(data.val())[0])
                        return Object.keys(data.val())[0];
                    }
                })
                .then((userID) => {
                    if(userID){
                        var updates = {};
                        updates['/' + DBRefs.PERSONINVITES + '/' + userID + '/' + invite.experienceId] = true;
                        updates['/' + DBRefs.EXPERIENCES + '/' + invite.experienceId + '/InvitedPeople/' + userID] = 'false';

                        return this.afDB.database.ref().update(updates);
                    }
                })
    }

    listInvites(): Observable<Invitation[]> {
        let url = DBRefs.BASE + DBRefs.PERSONINVITES + '/' + this.authService.getUser().uid;
            this.invitations = this.afDB.list(url)
                .mergeMap((mems) => {
                    if (mems.length === 0) {
                        //should exit
                        return Observable.of([]);
                    }
                    return Observable.forkJoin(
                        mems.map((mem) => {
                            return this.afDB.object(DBRefs.BASE + DBRefs.EXPERIENCES + '/' + mem.$key).first();
                        }
                        ),
                        (...values) => {
                            return values;
                        }
                    );
                })
    
            return this.invitations;
    }

    getNumberOfOutstandingInvites(){
        return this.afDB.list(DBRefs.PERSONINVITES + '/' + this.authService.getUser().uid)
    }
}