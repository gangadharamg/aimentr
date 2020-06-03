import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Data } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';
import { APIURL } from 'src/app/url';

import { ChatEvents } from 'src/app/services/models/chat-events';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-code-terminal-layout',
  templateUrl: './code-terminal-layout.component.html',
  styleUrls: ['./code-terminal-layout.component.scss']
})
export class CodeTerminalLayoutComponent implements OnInit {

  userRole: Number;
  sessionId: any;
  roles;

  course = {
    courseLevel:''
  }

  course_id ='';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private CommonService: CommonService,
    private socketService: ChatService,

  ) {
    route.params.subscribe((p) => {
      this.sessionId = p['id'];
     
    })

    this.route.queryParams.subscribe(params=>{
      this.course_id = params.Data;
      this.getcourseInfobyid();
    })

    
  }

  ngOnInit() {
    this.userRole = this.CommonService.getuserInfo().role;
    console.log("this.userrole=======>", this.userRole)
    this.roles = this.CommonService.getRoles();
   

    
    this.socketService.onEvent(ChatEvents.CONNECT)
    .subscribe(() => {
      console.log('Client connected');
    });

  this.socketService.onEvent(ChatEvents.DISCONNECT)
    .subscribe(() => {
      console.log('Client disconnected');
    });
  }


  getcourseInfobyid() {
    var url = APIURL.GET_COURSE_INFO_BY_ID;
    let postData = {
      courseId: this.course_id
    };
    this.CommonService.postMethod(url, postData)
      .subscribe((res: Data) => {
        console.log('res get course by id' , res)
        var course = res.data;
        this.course ={
          courseLevel : course.courseLevel
        }
      }, (err) => {
        console.log('err get course by id' , err);
      })
  }




  leftSession(data) {
    if (this.userRole == this.roles.student) {
      var url = APIURL.EXIT_FROM_SESSION;
    }
    if (this.userRole == this.roles.mentor) {
      var url = APIURL.END_SESSION;
    }
    let username = this.CommonService.getuserInfo().username;
    let postData = { username: username, sessionId: this.sessionId };
    this.CommonService.postMethod(url, postData)
      .subscribe((res: Data) => {
        // this.dataSrv.showToastMessage(res.message, 'success');
        console.log(data.api, "--------=====", res);
        this.router.navigate(['/home']);
      }, (err) => {
        // this.dataSrv.showToastMessage(err.message, 'error');
        console.log(data.api + " Exit from session:: ", err);
      })
  }

}
