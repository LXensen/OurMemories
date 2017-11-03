export class Message {
    userID: string;
    content: string;
    name: string;
    time: number = Date.now()
    constructor(UserId: string,
                Message: string,
                Name: string) {
            this.userID = UserId;
            this.content = Message;
            this.name = Name;
    }
}
