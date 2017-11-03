export class Invitation {
    personId: string;
    experienceId: string;
    constructor(PersonId: string,
                ExperienceId: string) {
        this.personId = PersonId;
        this.experienceId = ExperienceId;
    }
}
