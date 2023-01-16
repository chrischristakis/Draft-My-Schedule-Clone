import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  //Don't need this in deployment.
  readonly ROOT_URL = "http://localhost:3000/api"

  //Get a JWT
  login(email:string, password:string):Observable<string> {
    const data = {
      email: email,
      password: password
    }

    return this.http.post(this.ROOT_URL + '/users/login', data, { responseType: 'text' }) //The request must know the response is a string, not a json
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  //Update a logged in user's password.
  changepass(oldpass:string, newpass:string):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'auth-jwt': localStorage.getItem("jwt")
      })
    };
    const data = {
      old_password: oldpass,
      new_password: newpass
    }

    return this.http.put(this.ROOT_URL + '/users', data, httpOptions) //The request must know the response is a string, not a json
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  //Create a database entry
  register(email:string, name:string, password:string):Observable<any> {
    const data = {
      email: email,
      name: name,
      password: password
    }

    return this.http.post(this.ROOT_URL + '/users/register', data) //The request must know the response is a string, not a json
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  //get account type if user is logged in.
  getAccountType():Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'auth-jwt': localStorage.getItem("jwt")
      })
    };
    return this.http.get(this.ROOT_URL+ '/users', httpOptions)
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  //promote a user to an admin
  adminify(email:string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'auth-jwt': localStorage.getItem("jwt")
      })
    };
    return this.http.put(this.ROOT_URL+ '/admin/'+email, {},httpOptions)
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  //set user ad active or not (admin)
  setUserActive(email:string, active:boolean) {
    const httpOptions = {
      headers: new HttpHeaders({
        'auth-jwt': localStorage.getItem("jwt")
      })
    };
    return this.http.put(this.ROOT_URL+ '/users/'+email, {active:active},httpOptions)
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

}
