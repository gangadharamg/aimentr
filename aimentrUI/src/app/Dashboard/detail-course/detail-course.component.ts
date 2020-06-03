import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';
import { EncrDecrService } from '../../Services/encr-decr.service'
import { APIURL } from '../../url';
import { ToastrService } from 'ngx-toastr';
import { DataService } from "../../Services/share-data.service";



@Component({
  selector: 'app-detail-course',
  templateUrl: './detail-course.component.html',
  styleUrls: ['./detail-course.component.scss']
})
export class DetailCourseComponent implements OnInit {

  Student = false;

  roles;
  userInfo;

  MentorsList = [];
  CoursesList = [];
  defaultFilter = 'Mentors';


  constructor(
    private CommonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private EncrDecrService: EncrDecrService,
    private toastr: ToastrService,
    private DataService: DataService,
  ) {
    this.roles = this.CommonService.getRoles();
    this.userInfo = this.CommonService.getuserInfo();
    console.log("userInfo", this.roles, this.userInfo);

    this.defaultFilter = localStorage.getItem('defaultFilter');

    if (this.roles.student == this.userInfo.role) {
      this.Student = true;
    }

    this.GetUsersAndCourses();
  }

  ngOnInit(): void {
    this.DataService.currentMessage.subscribe(message => {
      if (message == 'chengeFilter') {
        localStorage.getItem('defaultFilter');
        this.defaultFilter = localStorage.getItem('defaultFilter');
        if (this.defaultFilter == 'Mentors') {
          this.GetUsersAndCourses();
        } else {
          this.GetCourses();
        }

      }
    })

  }


  GetUsersAndCourses() {
    var obj = {
      role: this.roles.mentor
    }
    var url = APIURL.GET_USERS_FOR_FILTERS;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          this.MentorsList = data.Data;
          console.log("GetAvailableCourses===>", this.MentorsList);
        }
      })
  }

  GetCourses() {
    var obj = {}
    var url = APIURL.GET_ALL_COURSES_OF_MENTOR;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          this.CoursesList = data.Data;
          console.log("CoursesList===>", this.CoursesList);

          this.CoursesList.forEach(course => {
             var backgroundValue = Math.floor(100000 + Math.random() * 900000);

            // var value = course.courseId.toString();
            // var backgroundValue = value.substring(0, 6);
            course.background = '#' + backgroundValue
          })
        }
      })
  }


  AddFollowing(item) {
    var obj = {
      mentor: item.email,
      studentEmail: this.userInfo.email,
      studentName: this.userInfo.firstname + " " + this.userInfo.lastname,
    }
    var url = APIURL.START_FOLLOWING;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          this.toastr.success(data.Message, 'Success');
          // this.CheckingFollowing();
        }
      })
  }



  viewDashboard(item) {
    console.log(item);
    var TransforData = {
      mentor: item
    }
    var StringifyedData = JSON.stringify(TransforData);
    var EncriptedData = this.EncrDecrService.set(StringifyedData);
    if (this.Student) {
      this.router.navigate(['/home/student/mentordashboard'], { queryParams: { Data: EncriptedData } });
    } else {
      if (item == this.userInfo.email) {
        this.router.navigate(['/home/mentor/dashboard']);
      } else {
        this.router.navigate(['/home/student/mentordashboard'], { queryParams: { Data: EncriptedData } });

      }
    }
  }


}
