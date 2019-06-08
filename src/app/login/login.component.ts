import {Component, Inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from "angular-webstorage-service";
import {RestService} from "../rest.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private router: Router, private rest: RestService) { }
  username: string;
  password: string;
  ngOnInit() {

  }
  login(): void {
    if (this.password === undefined || this.username === undefined) {
      alert('Please enter all fields!');
      return;
    }
    this.rest.login(this.username, this.password)
    .subscribe(
      res => {
        const result = JSON.parse(JSON.stringify(res));
        if (result.status) {
          this.storage.set('session_id', result.token);
          this.router.navigate(['home']);
        } else {
          alert (result.message);
        }
      },
      it => {
        alert('An error occurred, please try again later');
      }
    );
  }

}