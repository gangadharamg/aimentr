import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';
import { EncrDecrService } from '../../Services/encr-decr.service'
import { APIURL } from '../../url';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  userInfo;
  Requests = [];

  constructor(
    private CommonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private EncrDecrService: EncrDecrService,
    private toastr: ToastrService,
  ) {
    this.userInfo = this.CommonService.getuserInfo();

    console.log("userInfo", this.userInfo);

    this.getFollowers();
  }

  ngOnInit(): void { }

  getFollowers() {
    var obj = {
      mentor: this.userInfo.email,
      requestAccepted: false,
      requestRejected: false
    }
    var url = APIURL.GET_FOLLOWERS;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          this.Requests = data.Data;
        }
      })
  }


  RequestAccepted(item) {
    var obj = {
      mentor: this.userInfo.email,
      studentEmail: item.studentEmail,
      requestAccepted: true
    }
    var url = APIURL.UPDATE_FOLLOW_REQUEST_ACCEPTED_OR_REJECTED;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          console.log("request==>",data)
          if(data.Other.Success){
            this.toastr.success('Request accepted', 'Success');
            this.getFollowers();
          }
        
        }
      })
  }


  RequestRejected(item){
    var obj = {
      mentor: this.userInfo.email,
      studentEmail: item.studentEmail,
      requestRejected: true
    }
    var url = APIURL.UPDATE_FOLLOW_REQUEST_ACCEPTED_OR_REJECTED;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          this.toastr.success('Request rejected', 'Success');
          this.getFollowers();
        }
      })
  }


}
