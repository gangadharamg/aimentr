import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';
import { EncrDecrService } from 'src/app/Services/encr-decr.service'
import { APIURL } from 'src/app/url';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  userInfo;
  UrlData;
  ViewCourse = {
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
    endDate: ""
  };

  CourseDetails = {
    mentor: "",
    courseId: null,
    courseName: ""
  }


  constructor(
    private CommonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private EncrDecrService: EncrDecrService,
    private toastr: ToastrService,
  ) {
    this.userInfo = this.CommonService.getuserInfo();
    console.log("userInfo", this.userInfo);

    this.route.queryParams.subscribe(params => {

      if (params.Data) {
        var DecriptedData = this.EncrDecrService.get(params.Data);
        this.UrlData = JSON.parse(DecriptedData);
        this.CourseDetails = {
          mentor: this.UrlData.mentor,
          courseId: this.UrlData.courseId,
          courseName: this.UrlData.courseName,
        };
        console.log("UrlData", this.UrlData);
        this.GetSelectedCourse();
      }
    })


  }

  ngOnInit(): void {

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
          };

          console.log("GetAvailableCourses===>", this.ViewCourse);
        }
      })
  }

  ProceedToPay() {
    var transactionId = Date.now();
    var payload = {
      email: this.userInfo.email,
      username: this.userInfo.username,
      mobile: this.userInfo.personal.mobile,
      firstname: this.userInfo.firstname,
      lastname: this.userInfo.lastname,
      courseId: this.ViewCourse.courseId,
      courseName: this.ViewCourse.courseName,
      amount: this.ViewCourse.cost,
      TransactionId: transactionId
    }

    var url = APIURL.INSERT_PAYMENT_DETAILS;
    this.CommonService.postMethod(url, payload)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          this.toastr.success(data.Message, 'Success')
        } else {
          this.toastr.warning(data.Message, 'Error')
        }
      })
  }





}
