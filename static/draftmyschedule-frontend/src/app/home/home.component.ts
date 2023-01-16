import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { AuthService } from '../services/auth.service';
import { SubjectItem } from '../subjectItem';
import { ReviewItem } from '../reviewItem';
import { ScheduleComponent } from './schedule/schedule.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() subject_code: string ="";
  @Input() course_code: string ="";
  @Input() reviewtext:string ="";
  @Input() reviewrating:number;
  @ViewChild(ScheduleComponent) schComp: ScheduleComponent;
  text:string;
  admin:boolean = false;

  constructor(private coursesservice: CoursesService,
              private authservice: AuthService) { }

  ngOnInit(): void {
    this.authservice.getAccountType()
    .subscribe(
      (data) => {
        if(data.account_type == "admin")
        {
          this.admin = true;
        }
      },
      (error) => {
        alert(error);
      }
    );
  }

  //get time table entries for a subject/course pair.
  timetableEntries: SubjectItem[];
  search() {
    if(this.subject_code.length == 0 || this.course_code.length == 0)
      return alert('Invalid entry, must fill in both subject code and course code.')
    this.coursesservice.searchCourse(this.subject_code, this.course_code)
    .subscribe(
      (data) => {
        this.timetableEntries = data;
        for(let i = 0; i < this.timetableEntries.length; i++)
          this.timetableEntries[i].expanded=false;
      },
      (error) => {
        alert(error);
      }
    );
  }

  //Get all the reviews for a course and add them to an array.
  reviews: ReviewItem[] = [];
  expandItem(item:SubjectItem){
    item.expanded=true;
    this.coursesservice.getCourseReviews(item.subject, item.course_code)
    .subscribe(
      (data) => {
        //this is so the same reviews for a course don't keep getting added to the page.
        let found = this.reviews.filter(rev => rev.course_code !== item.course_code)
        if(found)
          this.reviews = found;


        //add reviews to the reviews array.
        for(let review of data)
          this.reviews.push(review);
      },
      (error) => {
        if(error.status == 408)
          return; // just means it cant find any reviews, shouldn't prompt an error.
        alert(error.message);
      }
    );
  }

  collapseItem(item:SubjectItem) {
    item.expanded=false;
  }

  submitReview(subject_code:string, course_code:string)
  {
    if(!this.reviewrating) return alert("Please enter a valid review rating.");
    this.coursesservice.submitCourseReview(subject_code, course_code, this.reviewtext, this.reviewrating)
    .subscribe(
      (data) => {
        alert('Review posted.');
      },
      (error) => {
        alert(error);
      }
    );
  }

  addToSch(item:SubjectItem) {
    this.schComp.add(item);
  }

  //this is to use ngFor a fixed amount of times for the ratings of a review.
  arrayOne(n: number): any[] {
    return Array(n);
  }

  //turn a user into an admin (Reserved for verified admins.)
  @Input() admin_email:string;
  adminify() {
    if(!this.admin_email) return alert('Please enter a valid email in the admin panel.');
    this.authservice.adminify(this.admin_email)
    .subscribe(
      (data) => {
        alert(data);
      },
      (error) => {
        alert(error);
      }
    );
  }

  //deactivates user account (ADMIN)
  deactivateUser() {
    if(!this.admin_email) return alert('Please enter a valid email in the admin panel.');
    this.authservice.setUserActive(this.admin_email, false)
    .subscribe(
      (data) => {
        alert('Successfully deactivated user.');
      },
      (error) => {
        alert(error);
      }
    );
  }

  //activates a user account (ADMIN)
  activateUser() {
    if(!this.admin_email) return alert('Please enter a valid email in the admin panel.');
    this.authservice.setUserActive(this.admin_email, true)
    .subscribe(
      (data) => {
        alert('Successfully activated user.');
      },
      (error) => {
        alert(error);
      }
    );
  }

  hideReview(review:ReviewItem, visible:boolean) {
    if(!review._id) return alert("Review doesn't have a valid id.");
    this.coursesservice.setReviewVisible(review._id, visible)
    .subscribe(
      (data) => {
        alert('Successfully set review to hidden: ' + visible);
        if(visible) //if they press unhide, then remove it from the hidden reviews list.
          this.hiddenrevs = this.hiddenrevs.filter(rev => rev._id !== review._id);
      },
      (error) => {
        alert(error);
      }
    );
  }

  hiddenrevs:ReviewItem[] = [];
  //get all hidden reviews (ADMIN)
  getHiddenReviews() {
    this.coursesservice.getHiddenReviews()
    .subscribe(
      (data) => {
        this.hiddenrevs =data;
      },
      (error) => {
        alert(error);
      }
    );
  }

}
