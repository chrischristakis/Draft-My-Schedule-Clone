import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() email: string = "";
  @Input() password: string = "";
  @Input() confirm_password: string = "";
  @Input() name: string = "";

  constructor(private authservice: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  register() {
    if(this.password != this.confirm_password)
      return alert("Passwords do not match. try again.");

    this.authservice.register(this.email, this.name, this.password)
    .subscribe(
      (data) => {
        alert("Success");
        this.router.navigate(["/login"]);
      },
      (error) => {
        alert(error);
      }
    );
  }

  back() {
    this.router.navigate(["/login"]);
  }

}
