import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dmca-policy',
  templateUrl: './dmca-policy.component.html',
  styleUrls: ['./dmca-policy.component.css']
})
export class DmcaPolicyComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirectLogin() {
    this.router.navigate(["/login"]);
  }

}
