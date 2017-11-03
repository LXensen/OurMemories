import { Experience } from './../models/experience-model';
import { DBRefs } from './../environments/config';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from './auth-service';
import { Injectable } from '@angular/core';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs';

@Injectable()
export class ExperienceService {
    private experienceRef: any;

    experiences: Observable<Experience[]>;

    constructor(private afDB: AngularFireDatabase,
        private authService: AuthService) {
        this.experienceRef = this.afDB.database.ref(DBRefs.EXPERIENCES)
    }

    getMyExperiences(): Observable<Experience[]> {
        let url = DBRefs.BASE + DBRefs.PERSONSEXPERIENCES + '/' + this.authService.getUser().uid;
        this.experiences = this.afDB.list(url)
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

        return this.experiences;
    }

    addExperience(Experience: Experience) {
        let newExperienceID = this.experienceRef.child(DBRefs.EXPERIENCES).push().key
debugger;
        Experience.creator = this.authService.getUser().uid;
        Experience.experienceId = newExperienceID

        var updates = {};
        updates[DBRefs.EXPERIENCES + '/' + newExperienceID] = Experience;
        updates['/Personsexperiences/' + this.authService.getUser().uid + '/' + newExperienceID] = true;

        this.afDB.database.ref().update(updates);
    }

    addFolderPic(url: string, experienceID: string){
        const memoryRef = this.afDB.object(DBRefs.EXPERIENCES + '/' + experienceID);
        memoryRef.update({ folderPic: url });
    }
}