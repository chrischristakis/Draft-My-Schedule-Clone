import { Component, OnInit, Input } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { CoursesService } from '../../services/courses.service';
import { SubjectItem } from '../../subjectItem';
import { ReviewItem } from '../../reviewItem';
import { PublicSch } from './publicSch';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  @Input() schname: string = "";
  @Input() description: string = "";
  @Input() newschname: string = "";
  public:boolean = false;
  description_res:string;
  public_schs:PublicSch[];
  editing:boolean=false;
  confirmDelete:boolean = false;

  constructor(private scheduleservice: ScheduleService,private coursesservice: CoursesService) { }

  ngOnInit(): void {
  }

  entries: SubjectItem[] = [];
  search() {
    this.confirmDelete = false;
    if(!this.schname) return alert('Please enter a schedule name.'); //make sure that user actually entered data
    this.entries = [];
    this.description_res = null; //reset description so it doesnt linger.
    this.scheduleservice.searchSch(this.schname)
    .subscribe(
      (data) => {
        this.description_res = data.description;
        for(let i = 0; i < data.courses.length; i++)
        {
          this.coursesservice.searchCourse(data.courses[i].subject, data.courses[i].course_code)
          .subscribe(
            (innerdata) => {
              this.entries.push(innerdata[0]); //sends as an array with one element, have to do this hack fix.
              for(let i = 0; i < this.entries.length; i++)
                this.entries[i].expanded=false;
            },
            (innererror) => {
              alert(innererror);
            }
          );
        }
      },
      (error) => {
        alert(error);
      }
    );
  }

  searchPublicSchs() {
    if(this.public_schs) return this.public_schs=null; //collapse the list back down.
    this.scheduleservice.getPublicSchsName()
    .subscribe(
      (data) => {
        this.public_schs = data;
      },
      (error) => {
        alert(error);
      }
    );
  }

  getPublicSch(sch:PublicSch) {
    if(!sch) return alert('Please enter a schedule name.'); //make sure that user actually entered data
    this.entries = [];
    this.scheduleservice.searchPublicSch(sch.sch_name)
    .subscribe(
      (data) => {
        this.description_res = data.description;
        for(let i = 0; i < data.courses.length; i++)
        {
          this.coursesservice.searchCourse(data.courses[i].subject, data.courses[i].course_code)
          .subscribe(
            (innerdata) => {
              this.entries.push(innerdata[0]); //sends as an array with one element, have to do this hack fix.
            },
            (innererror) => {
              alert(innererror);
            }
          );
        }
      },
      (error) => {
        alert(error);
      }
    );
  }

  //Create a new schedule
  create() {
    this.confirmDelete = false;
    if(!this.schname) return alert('Please select a valid schedule name.');
    this.scheduleservice.createSch(this.schname, this.description, this.public)
    .subscribe(
      (data) => {
        alert(data.message);
      },
      (error) => {
        alert(error);
      }
    );
  }

  //remove a course from schedules
  remove(item: SubjectItem) {
    this.scheduleservice.removeFromSch(this.schname, item.subject, item.course_code)
    .subscribe(
      (data) => {
        this.search();
      },
      (error) => {
        alert(error);
      }
    );
  }

  reviews: ReviewItem[] = [];
  expandItem(item:SubjectItem){
    item.expanded=true;
    this.coursesservice.getCourseReviews(item.subject, item.course_code)
    .subscribe(
      (data) => {
        //this is so the same reviews for a course don't keep getting added to the page.
        if(this.reviews.find(rev => rev.subject === item.subject && rev.course_code === item.course_code)) return;

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

  //Add a course to the selected schedule
  add(item: SubjectItem) {
    if(!this.schname) return alert('Please select a valid schedule');
    this.scheduleservice.addToSch(this.schname, item.subject, item.course_code)
    .subscribe(
      (data) => {
        alert(data.message);
      },
      (error) => {
        alert(error);
      }
    );
  }

  //update open edit fields
  editMode() {
    this.editing = !this.editing;
  }

  //actually submit the edit.
  submitEdit() {
    this.confirmDelete = false;
    if(!this.schname) return alert('Please select a valid schedule to edit');
    if(!this.newschname) this.newschname = this.schname; //just keep the name the same.
    this.scheduleservice.editSch(this.schname, this.newschname, this.description, this.public)
    .subscribe(
      (data) => {
        alert('Updated schedule.');
        this.editing = false;
      },
      (error) => {
        alert(error);
      }
    );
  }

  //delete the selected schedule
  delete() {
    this.confirmDelete = false;
    if(!this.schname) return alert('Please select a valid schedule');
    this.scheduleservice.deleteSch(this.schname)
    .subscribe(
      (data) => {
        alert(data.message);
      },
      (error) => {
        alert(error);
      }
    );
  }

  //toggle if schedule creation is about to be public or private
  togglePublic() {
    this.public = !this.public;
  }

  my_schs: PublicSch[] = [];
  //get all user scheduleSchs
  getMySchs() {
    if(this.my_schs) return this.my_schs=null; //collapse the list back down.
    this.scheduleservice.getUserSchs()
    .subscribe(
      (data) => {
        this.my_schs = data;
      },
      (error) => {
        alert(error);
      }
    );
  }

  //set the search parameter then bring up the time table
  searchMySch(schname:string) {
    this.schname = schname;
    this.search();
  }

  //this is to use ngFor a fixed amount of times for the ratings of a review.
  arrayOne(n: number): any[] {
    return Array(n);
  }

}
