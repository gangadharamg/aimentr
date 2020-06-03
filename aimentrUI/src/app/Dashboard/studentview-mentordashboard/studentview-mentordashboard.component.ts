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
  selector: 'app-studentview-mentordashboard',
  templateUrl: './studentview-mentordashboard.component.html',
  styleUrls: ['./studentview-mentordashboard.component.scss']
})
export class StudentviewMentordashboardComponent implements OnInit {
  userInfo;
  AvailableCourses = [];
  UrlData;
  MentorDetails;
  YourFollowing = false;


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

    this.route.queryParams.subscribe(params => {
      console.log(params.Data)
      if (params.Data) {
        var DecriptedData = this.EncrDecrService.get(params.Data);
        this.UrlData = JSON.parse(DecriptedData);
        this.getMentor();
      }
    })

    console.log("userInfo", this.userInfo);
  }

  ngOnInit(): void { }


  getMentor() {
    var obj = {
      email: this.UrlData.mentor,
    }
    var url = APIURL.GET_USER_BY_EMAIL;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          this.MentorDetails = data.Data;
          console.log(this.MentorDetails);
          this.GetMentorDetails();
        }
      })
  }

  GetMentorDetails() {
    var obj = {
      mentor: this.UrlData.mentor,
    }
    var url = APIURL.GET_ALL_COURSES_OF_MENTOR;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          this.AvailableCourses = data.Data;
          this.CheckingFollowing()
          this.GetAvailableCourses();
        }
      })
  }


  GetAvailableCourses() {
    var obj = {
      mentor: this.UrlData.mentor,
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


  CheckingFollowing() {
    var obj = {
      mentor: this.UrlData.mentor,
      studentEmail: this.userInfo.email,
      requestAccepted: true
    }
    var url = APIURL.CHECK_FOLLOWING_STATUS;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          if (data.Other.Success) {
            this.YourFollowing = true;
          }
        }
      })
  }


  AddFollowing() {
    var obj = {
      mentor: this.UrlData.mentor,
      studentEmail: this.userInfo.email,
      studentName: this.userInfo.firstname + " " + this.userInfo.lastname,
    }
    var url = APIURL.START_FOLLOWING;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          this.toastr.success(data.Message, 'Success');
          this.CheckingFollowing();
        }
      })
  }


  unFollow() {
    var obj = {
      mentor: this.UrlData.mentor,
      studentEmail: this.userInfo.email,
      unFollow:true
    }
    var url = APIURL.UPDATE_FOLLOW_REQUEST_ACCEPTED_OR_REJECTED;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          this.toastr.success('Unfollow Successfully', 'Success');
          this.CheckingFollowing();
        }
      })
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
    if (item.courseType == 'Offline') {
      this.router.navigate(['/home/offlinecourse/overview'], { queryParams: { Data: EncriptedData } });
    } else {
      this.router.navigate(['/home/onlinecourse/overview'], { queryParams: { Data: EncriptedData } });
    }
  }



  viewProfile() {
    var TransforData = {
      mentor: this.UrlData.mentor,
    }
    var StringifyedData = JSON.stringify(TransforData);
    var EncriptedData = this.EncrDecrService.set(StringifyedData);
    this.router.navigate(['/home/profile'], { queryParams: { Data: EncriptedData } });

  }






}
