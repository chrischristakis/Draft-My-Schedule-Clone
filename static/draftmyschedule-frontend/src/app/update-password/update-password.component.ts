import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  @Input() email: string = "";
  @Input() password: string = "";
  @Input() newpassword: string = "";

  constructor(private router: Router,
              private authservice: AuthService) { }

  ngOnInit(): void {
  }

  redirectLogin() {
    this.router.navigate(["/login"]);
  }

  changepass() {
    if(!this.email || !this.password || !this.newpassword) return alert('Please enter all info.');
    this.authservice.login(this.email, this.password)
    .subscribe(
      (data) => {
        localStorage.setItem("jwt", data);//save the token to local storage.
        //change the page to the homepage.
        this.authservice.changepass(this.password, this.newpassword)
        .subscribe(
          (data) => {
            alert(data.message);
          },
          (error) => {
            alert(error);
          }
        )
      },
      (error) => {
        alert(error);
      }
    );
  }

}
