import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';
import { EncrDecrService } from '../../Services/encr-decr.service'
import { APIURL } from '../../url'
import { ToastrService } from 'ngx-toastr';
enum roles {
  admin = 1,
  student = 2,
  mentor = 3
}
@Component({
  selector: 'app-otp-verifycation',
  templateUrl: './otp-verifycation.component.html',
  styleUrls: ['./otp-verifycation.component.scss']
})
export class OtpVerifycationComponent implements OnInit {

  userParams = "";

  VerifyOtp = {
    email: "",
    otp: ""
  }

  showErrMsg = false;
  UrlData;
  constructor(private CommonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private EncrDecrService: EncrDecrService,
    private toastr: ToastrService, ) {
    this.route.queryParams.subscribe(params => {
      console.log(params.Data)
      this.userParams = params.Data;
      var DecriptedData = this.EncrDecrService.get(params.Data);
      this.UrlData = JSON.parse(DecriptedData);

      this.VerifyOtp.email = this.UrlData.Email;

      console.log("UrlData", this.UrlData);
    })
  }

  ngOnInit() { }

  proceed() {
      var url = APIURL.VERIFY_OTP;
      this.CommonService.postMethod(url, this.VerifyOtp)
        .subscribe((data: Data) => {
          console.log("Data===>", data);
          if (data.success) {
            this.toastr.success(data.message, "Success !");
            if(this.UrlData.role == roles.mentor){
              this.router.navigate(['/mentorshipregistration'], { queryParams: { Data: this.userParams } })
            }else{
              this.router.navigate(['/studentprofile'], { queryParams: { Data: this.userParams } })
            }
            
          }
          else {
            this.toastr.warning(data.message, "Error !");
          }
        })
  }

  resendOtp() {

  }

}