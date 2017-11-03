import { AuthService } from './../../services/auth-service';
import { Subject } from 'rxjs/Subject';
import { SearchContactService } from './../../services/search-contact-service';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-searchcontactsmodal',
  templateUrl: 'searchcontactsmodal.html',
})
export class SearchcontactsmodalPage  implements OnInit {

  contacts;
  startAt = new Subject<string>();
  endAt = new Subject<string>();

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private authSVC: AuthService,
              private searchContactsSVC: SearchContactService) {
  }


  ngOnInit(){
    this.searchContactsSVC.getContacts(this.startAt, this.endAt, this.authSVC.getUser().uid)
        .subscribe(contacts => {
          //debugger;
          this.contacts = contacts
        })
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SearchcontactsmodalPage');
  }

  search($event){
    let q = $event.target.value;
    console.log(q);
    this.startAt.next(q);
    this.endAt.next(q+"\uf8ff");
    console.log($event);
  }
}
