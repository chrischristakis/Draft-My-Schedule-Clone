import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() email: string = "";
  @Input() password: string = "";

  constructor(private authservice: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.authservice.login(this.email, this.password)
    .subscribe(
      (data) => {
        localStorage.setItem("jwt", data);//save the token to local storage.
        //change the page to the homepage.
        this.router.navigate(["/home"]);
      },
      (error) => {
        alert(error);
      }
    );
  }

  //re route to the register page.
  register() {
    this.router.navigate(["/register"]);
  }

  privatePolicy() {
    this.router.navigate(["/documents/privacy"]);
  }

  dmcaPolicy() {
    this.router.navigate(["/documents/dmca"]);
  }

  auPolicy() {
    this.router.navigate(["/documents/aup"]);
  }

  changepass() {
    this.router.navigate(["/changepass"]);
  }

}
