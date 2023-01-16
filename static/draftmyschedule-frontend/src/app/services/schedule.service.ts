import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  readonly ROOT_URL = "http://localhost:3000/api"

  constructor(private http: HttpClient) { }

  //get course ID in a schedule.
  searchSch(schname:string):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'auth-jwt': localStorage.getItem("jwt")
      })
    };
    return this.http.get(this.ROOT_URL + '/schedules/'+schname, httpOptions)
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  //edit a schedule's info
  editSch(schname:string, newschname:string, description:string, publicsch:boolean) {
    const httpOptions = {
      headers: new HttpHeaders({
        'auth-jwt': localStorage.getItem("jwt")
      })
    };
    let load;
    if(description)
      load = {
        name:newschname,
        description:description,
        'public':publicsch
      };
    else
      load = {
        name:newschname,
        'public':publicsch
      };

    return this.http.put(this.ROOT_URL + '/schedules/'+schname, load, httpOptions)
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  //Add course to schedule
  addToSch(schname:string, subject:string, course_code:string):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'auth-jwt': localStorage.getItem("jwt")
      })
    };
    const load = {
      subject_code:subject,
      course_code:course_code
    };
    return this.http.post(this.ROOT_URL + '/schedules/'+schname, load, httpOptions)
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  //delete a schedule
  deleteSch(schname:string):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'auth-jwt': localStorage.getItem("jwt")
      })
    };
    return this.http.delete(this.ROOT_URL + '/schedules/'+schname, httpOptions)
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  //create a schedule
  createSch(schname:string, desc:string, publicsch:boolean):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'auth-jwt': localStorage.getItem("jwt")
      })
    };
    let load;
    if(desc)
    {
      load = {
        name:schname,
        description:desc,
        public:publicsch
      };
    }
    else
    {
      load = {
        name:schname,
        public:publicsch
      };
    }

    return this.http.put(this.ROOT_URL + '/schedules', load, httpOptions)
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  //update schedule info

  //get all public schedule names and edit dates.
  getPublicSchsName():Observable<any> {
    return this.http.get(this.ROOT_URL + '/schedules')
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  //get courses in a public schedule
  searchPublicSch(schname:string):Observable<any> {
    return this.http.get(this.ROOT_URL + '/schedules/public/'+schname)
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  //Remove course from schedule
  removeFromSch(schname:string, subject:string, course_code:string):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'auth-jwt': localStorage.getItem("jwt")
      })
    };
    return this.http.delete(this.ROOT_URL + '/schedules/'+schname+'/'+subject+'/'+course_code, httpOptions)
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  //get a user's schedules
  getUserSchs():Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'auth-jwt': localStorage.getItem("jwt")
      })
    };
    return this.http.get(this.ROOT_URL + '/schedules/user/getall', httpOptions)
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

}
