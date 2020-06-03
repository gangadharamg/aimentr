import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';
import { EncrDecrService } from '../../Services/encr-decr.service'
import { APIURL } from '../../url';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mentor-followers',
  templateUrl: './mentor-followers.component.html',
  styleUrls: ['./mentor-followers.component.scss']
})
export class MentorFollowersComponent implements OnInit {
  userInfo;
  Followers = [];

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
      requestAccepted: true
    }
    var url = APIURL.GET_FOLLOWERS;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          this.Followers = data.Data;
        }
      })
  }



}
