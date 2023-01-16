import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-au-policy',
  templateUrl: './au-policy.component.html',
  styleUrls: ['./au-policy.component.css']
})
export class AuPolicyComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirectLogin() {
    this.router.navigate(["/login"]);
  }

}
