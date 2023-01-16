import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { ReviewItem } from '../reviewItem';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  readonly ROOT_URL = "http://localhost:3000/api"

  constructor(private http: HttpClient) { }

  searchCourse(subject_code:string, course_code:string):Observable<any> {
    return this.http.get<any>(this.ROOT_URL + '/subjects/'+subject_code+'/'+course_code) //The request must know the response is a string, not a json
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  getCourseReviews(subject_code:string, course_code:string):Observable<any> {
    return this.http.get<any>(this.ROOT_URL + '/reviews/'+subject_code+'/'+course_code) //The request must know the response is a string, not a json
    .pipe(
      catchError((error) => {
        return throwError({message:`${error.message}: ${error.error}`, status:error.status});
      })
    )
  }

  submitCourseReview(subject_code:string, course_code:string, text:string, rating:number):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'auth-jwt': localStorage.getItem("jwt")
      })
    };
    if(text.length == 0) text = undefined; //just remove it from the body if it's empty
    const load = {
        subject_code:subject_code,
      	course_code:course_code,
      	text:text,
      	rating:rating
      };

    return this.http.post(this.ROOT_URL + '/reviews', load, httpOptions)
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  //set a review's visibility flag. (ADMIN)
  setReviewVisible(id:string, hidden:boolean):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'auth-jwt': localStorage.getItem("jwt")
      })
    };
    const load = {
        hidden:hidden
    };

    return this.http.put(this.ROOT_URL + '/reviews/'+id, load, httpOptions)
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }

  //get all hidden reviews. (ADMIN)
  getHiddenReviews():Observable<ReviewItem[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'auth-jwt': localStorage.getItem("jwt")
      })
    };

    return this.http.get<ReviewItem[]>(this.ROOT_URL + '/reviews/hidden', httpOptions)
    .pipe(
      catchError((error) => {
        return throwError(error.message + " :" + error.error);
      })
    )
  }
}
