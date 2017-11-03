import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

import 'firebase/storage';

declare var window: any;

@Injectable()
export class ImageService {

    constructor(private afDB: AngularFireDatabase) { }

    convertURIToBlob(path: string) {
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(path, (fileEntry) => {

                fileEntry.file((resFile) => {

                    var reader = new FileReader();
                    reader.onloadend = (evt: any) => {
                        var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
                        imgBlob.name = 'sample.jpg';
                        resolve(imgBlob);
                    };

                    reader.onerror = (e) => {
                        reject(e);
                    };

                    reader.readAsArrayBuffer(resFile);
                });
            });
        });
    }

    uploadToFirebase(data: any, folderName: string): Promise<any> {
        let filename = UUID.UUID();

        let parseUpload: any;

        return new Promise((resolve, reject) => {

            let storageRef = this.afDB.app.storage().ref(`${folderName}/${filename}.jpg`);

            parseUpload = storageRef.put(data);

            parseUpload.on('state_changed', (_snapshot) => {
                // We could log the progress here IF necessary
                console.log('uploading.... ');
            },
                (_err) => {
                    console.log('upload service failed');
                    reject(_err);
                },
                (success) => {
                    resolve({ URL: parseUpload.snapshot.downloadURL, filename: filename });
                    console.log('upload service resolve worked');
                });
        });
    }
}