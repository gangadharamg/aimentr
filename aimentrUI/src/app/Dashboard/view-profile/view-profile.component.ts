import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';
import { EncrDecrService } from '../../Services/encr-decr.service'
import { APIURL } from '../../url';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {

  userInfo;
  UrlData;
  profile;

  constructor(
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
          this.profile = data.Data;
          console.log(this.profile);
        }
      })
  }

}
