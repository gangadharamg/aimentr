import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, NgModel } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';
import { EncrDecrService } from '../../Services/encr-decr.service'
import { APIURL } from '../../url';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse, HttpHeaders
} from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard-courses',
  templateUrl: './dashboard-courses.component.html',
  styleUrls: ['./dashboard-courses.component.scss']
})
export class DashboardCoursesComponent implements OnInit {

  userInfo;
  AvailableCourses = [];
  EditMode = false;

  listAvailableCourses = [];
  listUpcommingCourses = [];
  ShowPublishedCourses = true;

  constructor(
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    private CommonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private EncrDecrService: EncrDecrService,
    private toastr: ToastrService,
  ) {
    this.userInfo = this.CommonService.getuserInfo();

    console.log("userInfo", this.userInfo);

    this.GetAvailableCourses();
  }

  ngOnInit(): void {

  }


  GetAvailableCourses() {
    var obj = {
      mentor: this.userInfo.email,
    }
    var url = APIURL.GET_ALL_COURSES_OF_MENTOR;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {

        if (data.Status == 200) {
          this.AvailableCourses = data.Data;

          // startDate: "2020-04-19T18:30:00.000Z"
          // endDate
          this.AvailableCourses.forEach(course => {
            course.CompletedDuration = 0;
            var startdate = new Date(course.startDate)
            course.endDate = startdate.setDate(startdate.getDate() + parseInt(course.duration));
            const dateIsAfter = moment(Date.now()).isAfter(moment(course.startDate));
            if (dateIsAfter) {
              // console.log("------duration Start-------");
              const dateIsBefore = moment(Date.now()).isBefore(moment(course.endDate));
              if (dateIsBefore) {
                // console.log("-------duration in process------");
                const CorrentDate = moment(Date.now());
                const courseStartDate = moment(course.startDate);
                const CompletedDays = CorrentDate.diff(courseStartDate, 'days');
                const TotalDuration = parseInt(course.duration);
                // console.log("CompletedDays",CompletedDays , "Duration" , parseInt(course.duration) );
                const CompletedPercentage = (CompletedDays * 100) / TotalDuration;
                course.CompletedDuration = CompletedPercentage;
                // console.log("CompletedPercentage",CompletedPercentage );
              } else {
                // console.log("duration end")
                course.CompletedDuration = 100;
              }
            } else {
              // console.log("duration is not begin")
              course.CompletedDuration = 0;
            }


          })
          console.log("GetAvailableCourses===>", this.AvailableCourses);

          this.listAvailableCourses = this.AvailableCourses.filter(x => x.courseMode == '1');
          this.listUpcommingCourses = this.AvailableCourses.filter(x => x.courseMode == '0')



        }
      })
  }


  OpenPublishedCourses() {
    this.ShowPublishedCourses = true;
  }

  OpenUpcommingCourses() {
    this.ShowPublishedCourses = false;
  }





  CourseOverView(item) {
    console.log(item)
    var CourseData = {
      mentor: item.mentor,
      courseId: item.courseId,
      courseName: item.courseName,
    }
    var StringifyedData = JSON.stringify(CourseData);
    var EncriptedData = this.EncrDecrService.set(StringifyedData);
    // this.router.navigate(['/home/courseview'], { queryParams: { Data: EncriptedData } });
    if (item.courseType == 'Offline') {
      this.router.navigate(['/home/offlinecourse/overview'], { queryParams: { Data: EncriptedData } });
    } else {
      this.router.navigate(['/home/onlinecourse/overview'], { queryParams: { Data: EncriptedData } });
    }
  }



  EditCourse(item) {
    if (this.EditMode) {
      var CourseData = {
        mentor: item.mentor,
        courseId: item.courseId,
        courseName: item.courseName,
      }
      var StringifyedData = JSON.stringify(CourseData);
      var EncriptedData = this.EncrDecrService.set(StringifyedData);
      this.router.navigate(['/home/courseupload'], { queryParams: { EditData: EncriptedData } });

    }
  }
  EditUpcommingCourse(item) {
    var CourseData = {
      mentor: item.mentor,
      courseId: item.courseId,
      courseName: item.courseName,
    }
    var StringifyedData = JSON.stringify(CourseData);
    var EncriptedData = this.EncrDecrService.set(StringifyedData);
    this.router.navigate(['/home/courseupload'], { queryParams: { EditData: EncriptedData } });
  }


  viewProfile() {

    var TransforData = {
      mentor: this.userInfo.email,
    }
    var StringifyedData = JSON.stringify(TransforData);
    var EncriptedData = this.EncrDecrService.set(StringifyedData);
    this.router.navigate(['/home/profile'], { queryParams: { Data: EncriptedData } });

  }
  // ShowMentorFollowers(){
  //   this.router.navigate(['/home/courseupload']);
  // }




  gotocalssroom(item) {
    console.log(item)
    var CourseData = {
      mentor: item.mentor,
      courseId: item.courseId,
      courseName: item.courseName,
      showPop: true
    }
    var StringifyedData = JSON.stringify(CourseData);
    var EncriptedData = this.EncrDecrService.set(StringifyedData);
    // this.router.navigate(['/home/courseview'], { queryParams: { Data: EncriptedData } });
    if (item.courseType == 'Offline') {
      this.router.navigate(['/home/student/video'], { queryParams: { Data: EncriptedData } });
    } else {
      this.router.navigate(['/home/onlinecourse/overview'], { queryParams: { Data: EncriptedData } });
    }
  }



}
