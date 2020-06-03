import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';
import { EncrDecrService } from '../../Services/encr-decr.service'
import { APIURL } from '../../url';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-online-course-overview',
  templateUrl: './online-course-overview.component.html',
  styleUrls: ['./online-course-overview.component.scss']
})
export class OnlineCourseOverviewComponent implements OnInit {


  roles;
  userInfo;
  UrlData;
  ViewCourse = {
    _id: "",
    mentor: "",
    courseId: null,
    courseName: "",
    prerequisites: "",
    cost: null,
    description: "",
    courseType: "",
    duration: "",
    skillLevel: "",
    skills: [],
    tags: "",
    startDate: "",
    endDate: "",
    baches: []
  };

  CourseDetails = {
    mentor: "",
    courseId: null,
    courseName: ""
  }

  AllTopics = [];
  AllSubtopics = [];
  SelectedTopicName = "";
  AllEnrolledStudents = [];

  courseUrldata;

  Student = false;
  bachname = "";

  StartSubtopic;

  @ViewChild('startSession', { static: true }) startSession: ModalDirective;

  constructor(
    private CommonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private EncrDecrService: EncrDecrService,
    private toastr: ToastrService,
  ) {
    this.userInfo = this.CommonService.getuserInfo();
    this.roles = this.CommonService.getRoles()
    console.log("userInfo", this.userInfo);



    this.route.queryParams.subscribe(params => {
      if (params.Data) {
        this.courseUrldata = params.Data;
        var DecriptedData = this.EncrDecrService.get(params.Data);
        this.UrlData = JSON.parse(DecriptedData);
        this.CourseDetails = {
          mentor: this.UrlData.mentor,
          courseId: this.UrlData.courseId,
          courseName: this.UrlData.courseName,
        };
        console.log("UrlData", this.UrlData);
        this.GetSelectedCourse();

        if (this.roles.student == this.userInfo.role) {
          this.Student = true;
        } else {
          if (this.CourseDetails.mentor == this.userInfo.email) {
            this.Student = false;
          } else {
            this.Student = true;
          }
        }
      }
    })


  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    if (this.UrlData.showPop) {
      this.startSession.show();
    }
  }

  GetSelectedCourse() {
    var obj = {
      courseId: this.CourseDetails.courseId,
    }
    var url = APIURL.GET_ALL_COURSES_OF_MENTOR;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          var SelectedCourse = data.Data[0];
          this.ViewCourse = {
            _id: SelectedCourse._id,
            mentor: SelectedCourse.mentor,
            courseId: SelectedCourse.courseId,
            courseName: SelectedCourse.courseName,
            prerequisites: SelectedCourse.prerequisites,
            cost: SelectedCourse.cost,
            description: SelectedCourse.description,
            courseType: SelectedCourse.courseType,
            duration: SelectedCourse.duration,
            skillLevel: SelectedCourse.skillLevel,
            skills: SelectedCourse.skills,
            tags: SelectedCourse.tags,
            startDate: SelectedCourse.startDate,
            endDate: SelectedCourse.endDate,
            baches: SelectedCourse.baches,
          };

          console.log("GetAvailableCourses===>", this.ViewCourse);
          this.GetTopicsList();

        }
      })
  }



  GetTopicsList() {
    var obj = {
      mentor: this.CourseDetails.mentor,
      courseId: this.CourseDetails.courseId
    }
    var url = APIURL.GET_TOPICS_OF_COURSE;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        console.log("AllTopics===>", data);
        if (data.Success) {
          this.AllTopics = data.Data;
          this.GetEnrolledStudent();

        }

      })
  }

  GetSubTopicsList(item) {
    this.SelectedTopicName = item.topicName;
    var obj = {
      mentor: this.CourseDetails.mentor,
      courseId: this.CourseDetails.courseId,
      topicId: item.topicId
    }
    var url = APIURL.GET_SUB_TOPICS_OF_COURSE;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        console.log("AllSubtopics===>", data);
        if (data.Success) {
          this.AllSubtopics = data.Data;
        }
      })
  }

  GetEnrolledStudent() {
    var obj = {
      courseId: this.CourseDetails.courseId,
    }
    var url = APIURL.GET_PAID_USERS;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        console.log("Paid Users===>", data);
        if (data.Success) {
          this.AllEnrolledStudents = data.Data;
        }
      })
  }



  // CourseOverView(item) {
  //   console.log(item)
  //   var CourseData = {
  //     mentor: item.mentor,
  //     courseId: item.courseId,
  //     courseName: item.courseName,
  //   }
  //   var StringifyedData = JSON.stringify(CourseData);
  //   var EncriptedData = this.EncrDecrService.set(StringifyedData);
  //   this.router.navigate(['/home/courseview'], { queryParams: { Data: EncriptedData } });

  // }


  buyCourse() {
    // if(this.userInfo.role == this.roles.student ){
    this.router.navigate(['/home/payment'], { queryParams: { Data: this.courseUrldata } });
    // }
  }


  editCourse() {
    var CourseData = {
      mentor: this.CourseDetails.mentor,
      courseId: this.CourseDetails.courseId,
      courseName: this.CourseDetails.courseName,
    }
    var StringifyedData = JSON.stringify(CourseData);
    var EncriptedData = this.EncrDecrService.set(StringifyedData);
    this.router.navigate(['/home/courseupload'], { queryParams: { EditData: EncriptedData } });
  }





  // demoVideoUrl = "https://v3demo.mediasoup.org/?roomId="
  // // demoVideoUrl = "https://aimentrvideo.herokuapp.com/?userName="

  // @ViewChild('firstvideoclick', { static: true }) firstvideoclick: ElementRef;

  // SessionStart() {

  //   let date = new Date();
  //   var hash = this.ViewCourse._id + '_' + date.getTime();
  //   var postdata = {
  //     courseId: this.ViewCourse._id,
  //     hash: hash,
  //     username: this.userInfo.username,
  //     batch: this.bachname
  //   }
  //   var url = APIURL.CREATE_SESSION
  //   this.CommonService.postMethod(url, postdata)
  //     .subscribe((res: any) => {
  //       this.demoVideoUrl += res.data['_id'];
  //       // this.demoVideoUrl += this.userInfo.username;;
  //       console.log("this.demoVideoUrl", this.demoVideoUrl);
  //       setTimeout(() => {
  //         this.firstvideoclick.nativeElement.click();
  //       }, 500)

  //       // this.router.navigate(['/home/livesession', res.data['_id']], { queryParams: { Data: this.ViewCourse._id } });
  //     }, (err) => {
  //       console.log("Failed:: ", err);
  //     })

  // }


  SessionStart() {

    let date = new Date();
    var hash = this.ViewCourse._id + '_' + date.getTime();
    var postdata = {
      courseId: this.ViewCourse._id,
      hash: hash,
      userName: this.userInfo.username,
      roomName: this.CourseDetails.mentor + this.CourseDetails.courseName + hash,
      batchId: this.bachname,
      topicId: "",
      subtopicId: ""
    }
    var url = APIURL.CREATE_VIDEO_SESSION
    this.CommonService.postMethod(url, postdata)
      .subscribe((res: Data) => {

        // console.log("CREATE_VIDEO_SESSION::", data)
        var data = res.Data;
        var NewSessionObj = {
          courseId: data.courseId,
          batchId: data.batchId,
          topicId: data.topicId,
          subtopicId: data.subtopicId,
          users: data.users,
          admin: data.admin,
          roomName: data.roomName,
          roomSId: data.roomSId,
          sessionToken: data.sessionToken,
        }

        var StringifyedData = JSON.stringify(NewSessionObj);
        var EncriptedData = this.EncrDecrService.set(StringifyedData);
        this.router.navigate(['/home/twilio'], { queryParams: { Data: EncriptedData } })

      }, (err) => {
        console.log("Failed:: ", err);
      })

  }

  openFirstVideo() { };

}
