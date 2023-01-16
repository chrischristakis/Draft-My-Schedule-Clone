import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-private-policy',
  templateUrl: './private-policy.component.html',
  styleUrls: ['./private-policy.component.css']
})
export class PrivatePolicyComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirectLogin() {
    this.router.navigate(["/login"]);
  }

}
