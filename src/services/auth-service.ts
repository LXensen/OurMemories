import { DBRefs } from './../environments/config';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
    private token: string;

    constructor(private afAuth: AngularFireAuth,
                private afDb: AngularFireDatabase) { }

    signUpUser(email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        // .then(
        // response => {
        //     firebase.auth().currentUser.getIdToken()
        //         .then(
        //         (token: string) => this.token = token
        //         );
        //     this._isAuthenticated = true;
        // }
        // )
        // .catch(
        // error => console.log(error)
        // // TODO: more robust handling
        // );
    }

    createApplicationUser(name: string, email: string, uid: string) {
        console.log(name.split(' ').map(function (s) { return s.charAt(0); }).join(''))
        
        return  this.afDb.object(DBRefs.PERSON + '/' + uid).set({name: name, email: email, avatar: name.split(' ').map(function (s) { return s.charAt(0); }).join('')})
    }

    getApplicationUser(uid: string){
        return this.afDb.object(DBRefs.PERSON + '/' + uid).take(1)
    }
    signInUser(email: string, password: string) {
        //return firebase.auth().signInWithEmailAndPassword(email, password)
        //this.isLoggedInSource.next(true);
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
        // .then(
        // () => this._isAuthenticated = true
        // )
        // .catch(
        // error => console.log(error)
        // // TODO: more robust handling
        // );
    }

    signOutUser() {
        //this.isLoggedInSource.next(false);
        return this.afAuth.auth.signOut()
        // .then(
        // () => this._isAuthenticated = false
        // // TODO: redirect
        // )
        // .catch(
        // error => console.log(error)
        // // TODO: more robust handling
        // );
    }

    getToken() {
        this.afAuth.auth.currentUser.getIdToken()
            .then((token) => this.token = token
            );
        return this.token
    }

    getUser() {
        //console.log('auth-service.getUser says current user is: ' + firebase.auth().currentUser.uid);
        //return firebase.auth().currentUser;
        return this.afAuth.auth.currentUser;
    }
}