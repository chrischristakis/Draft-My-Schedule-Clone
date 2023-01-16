import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RoutingModule } from './routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ScheduleComponent } from './home/schedule/schedule.component';
import { PrivatePolicyComponent } from './private-policy/private-policy.component';
import { DmcaPolicyComponent } from './dmca-policy/dmca-policy.component';
import { AuPolicyComponent } from './au-policy/au-policy.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ScheduleComponent,
    PrivatePolicyComponent,
    DmcaPolicyComponent,
    AuPolicyComponent,
    UpdatePasswordComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
