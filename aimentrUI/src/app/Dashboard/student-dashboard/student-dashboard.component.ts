import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';
import { EncrDecrService } from '../../Services/encr-decr.service'
import { APIURL } from '../../url';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as moment from 'moment';
@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  userInfo;
  UrlData;
  OfflinecoursesView = true;

  PaidCourses = [];
  AvailableCourses = [];
  OfflineCoursesList = [];
  OnlineCoursesList = [];


  AllTopics = [];
  AllSubtopics = [];




  constructor(
    private CommonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private EncrDecrService: EncrDecrService,
    private toastr: ToastrService,
  ) {
    this.userInfo = this.CommonService.getuserInfo();

    this.GetpaidCourses();
    console.log("userInfo", this.userInfo);

  }

  ngOnInit(): void { }




  GetpaidCourses() {
    var obj = {
      email: this.userInfo.email,
    }
    var url = APIURL.GET_PAID_COURSES;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          this.PaidCourses = data.Data;
          console.log("this.getpaid courses", this.PaidCourses)
          this.GetAvailableCourses();

        }
      })
  }



  GetAvailableCourses() {
    var courseIds = [];
    this.PaidCourses.forEach(x => {
      courseIds.push(x.courseId)
    })

    var obj = {
      courseIds: courseIds
    }
    console.log("obj", obj)
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

          this.OfflineCoursesList = this.AvailableCourses.filter(x => x.courseType == 'Offline');
          this.OnlineCoursesList = this.AvailableCourses.filter(x => x.courseType == 'Online')
          this.getTopics();
        }
      })
  }


  getTopics() {
    var courseIds = [];
    this.OnlineCoursesList.forEach(x => {
      courseIds.push(x.courseId)
    })
    var obj = {
      courseIds: courseIds
    }

    var url = APIURL.GET_TOPICS_BASED_ON_COURSEIDS;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          this.AllTopics = data.Data;
          console.log("this.AllTopics", this.AllTopics)
          this.OnlineCoursesList.forEach(x => {
            x.AllTopics = [];
            this.AllTopics.forEach(y => {
              if (x.courseId == y.courseId) {
                x.AllTopics.push(y);
              }
            })
          })

          console.log("OnlineCoursesList===>", this.OnlineCoursesList);
          // this.GetSubTopicsList(obj)
        }
      })

  }

  GetSubTopicsList(obj) {
    var url = APIURL.GET_SUBTOPICS_BASED_ON_COURSEIDS;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        console.log("AllSubtopics===>", data);
        if (data.Success) {
          this.AllSubtopics = data.Data;
        }
      })
  }


  OffLineCourses() {
    this.OfflinecoursesView = true;
  }

  OnlineCourses() {
    this.OfflinecoursesView = false;
  }




  gotocalssroom(item) {
    console.log(item)
    var CourseData = {
      mentor: item.mentor,
      courseId: item.courseId,
      courseName: item.courseName,
    }
    var StringifyedData = JSON.stringify(CourseData);
    var EncriptedData = this.EncrDecrService.set(StringifyedData);
    this.router.navigate(['/home/student/video'], { queryParams: { Data: EncriptedData } });

  }



 demoVideoUrl = "https://v3demo.mediasoup.org/?roomId="
//  demoVideoUrl = "https://aimentrvideo.herokuapp.com/?userName="

  @ViewChild('firstvideoclick', { static: true }) firstvideoclick: ElementRef;
  
  joinSession(item) {
    var obj = {
      username: this.userInfo.username,
      courseId: item._id
    }
    var url = APIURL.JOIN_SESSION;
    this.CommonService.postMethod(url, obj)
      .subscribe((res: Data) => {
        // this.router.navigate(['/home/livesession', res.data['_id']], { queryParams: { Data: item._id } });
        
        this.demoVideoUrl += res.data['_id'];

        // this.demoVideoUrl += this.userInfo.username;;
        console.log("this.demoVideoUrl", this.demoVideoUrl);
        console.log(res)
        // setTimeout(() => {
        //   this.firstvideoclick.nativeElement.click();
        // }, 500)

        let data = res.sessionData[res.sessionData.length - 1]
        var NewSessionObj = {
          courseId: data.courseId,
          batchId: data.batchId,
          topicId: data.topicId,
          subtopicId: data.subtopicId,
          users: data.users,
          admin: data.admin,
          roomName: data.roomName,
          roomSId: data.roomSId,
          sessionToken: data.sessionToken
        }

        var StringifyedData = JSON.stringify(NewSessionObj);
        var EncriptedData = this.EncrDecrService.set(StringifyedData);
        this.router.navigate(['/home/twilio'], { queryParams: { Data: EncriptedData } })

      },
        (err) => {
          console.log('Failed:: ', err);
        })
  }



  viewProfile() {

    var TransforData = {
      mentor: this.userInfo.email,
    }
    var StringifyedData = JSON.stringify(TransforData);
    var EncriptedData = this.EncrDecrService.set(StringifyedData);
    this.router.navigate(['/home/student'], { queryParams: { Data: EncriptedData } });

  }
  openFirstVideo(){};



}

