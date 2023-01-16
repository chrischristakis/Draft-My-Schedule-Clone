import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PrivatePolicyComponent } from './private-policy/private-policy.component';
import { DmcaPolicyComponent } from './dmca-policy/dmca-policy.component';
import { AuPolicyComponent } from './au-policy/au-policy.component';
import {UpdatePasswordComponent } from './update-password/update-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'documents/privacy', component: PrivatePolicyComponent },
  { path: 'documents/dmca', component: DmcaPolicyComponent },
  { path: 'documents/aup', component: AuPolicyComponent },
  { path: 'changepass', component: UpdatePasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
