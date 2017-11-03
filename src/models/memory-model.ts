export class Memory {
    filename: string;
    uploadedBy: string;
    experienceId: string = null;
    url?: string = '';
    constructor(FileName: string,
                Uploader: string, 
                ExperienceId: string, 
                URL?: string) {
            this.filename = FileName;
            this.uploadedBy = Uploader;
            this.experienceId = ExperienceId;            
            this.url = URL;
    }
}
