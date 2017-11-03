import { LoadingController } from 'ionic-angular';
export class Experience {
    title: string;
    creator: string;
    experienceId?: string = null;
    location?: string = '';
    friends?: string[];
    folderPic?: string = '';
    constructor(Title: string, Creator: string, ExperienceId?: string, Location?: string, Friends?: string[]) {
        this.title = Title;
        this.creator = Creator;
        this.location = Location;
    }
}
