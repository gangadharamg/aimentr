import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';
import { EncrDecrService } from '../../Services/encr-decr.service'
import { APIURL } from '../../url';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  url: string = 'http://localhost:3000/';
  loginForm: FormGroup;

  roles;


  constructor(private formBuilder: FormBuilder,
    private CommonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private EncrDecrService: EncrDecrService,
    private toastr: ToastrService, ) {

    this.roles = this.CommonService.getRoles();

    console.log("this.roles", this.roles);
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
      // remember: ['']
    });
  }


  login() {
    console.log(this.loginForm.value);

    var url = APIURL.AUTH_LOGIN_USER;
    this.CommonService.loginOrRegister(url, this.loginForm.value)
      .subscribe((data: Data) => {
        console.log("Data===>", data);
        if (data.success) {

          this.toastr.success("Login Successfully!", "Success !");

          if (data.user.role == this.roles.student) {
            this.router.navigate(['/home'])
          }
          else if (data.user.role == this.roles.mentor) {
            this.router.navigate(['/home/mentor/dashboard'])
          }


        }
        else {
          this.toastr.warning(data.msg, "Error !");
        }
      })
  }


  // login() {
  //   this.isSubmitted = true;
  //   if (this.loginForm.invalid) {
  //     return;
  //   }
  //   for (const val of this.getKeys(this.loginForm.value)) {
  //     console.log("val:: ",val);
  //     this.loginForm.value[val] = this.loginForm.value[val].trim();
  //   }
  //   this.submissionInProgress = true;
  //   this.authSrv.login(this.loginForm.value).subscribe( data => {
  //     this.resetFormFields();
  //     if (data && data.user) {

  //       if(!!data.user.verified) {
  //         if (data.user.profileUpdated) {
  //           this.router.navigateByUrl(ProjConstant.HOME_ROUTE);
  //         } else {
  //           const role = this.dataSrv.getExpanedRole(this.authSrv.getUserDetails('role')).toLowerCase();
  //           this.router.navigateByUrl(`auth/profile/${role}`);
  //         }
  //       }else {
  //         this.router.navigateByUrl(ProjConstant.MAIL_VERIFICATION);
  //       }

  //     } else {
  //       this.dataSrv.showToastMessage( data.error.msg, 'error');
  //       this.submissionInProgress = false;
  //     }
  //     this.submissionInProgress = false;
  //   }, error => {
  //     this.dataSrv.showToastMessage( error.error.message, 'error');
  //     this.submissionInProgress = false;
  //   }, () => {
  //     this.submissionInProgress = false;
  //   });
  // }

  // checkForValidUser() {
  //   let postData: any = {};
  //   postData.username = this.loginForm.get('username').value;
  //   this.httpSrv.makeGetApiCall('VALIDATE_USER', postData).subscribe( data => {
  //       this.isValidUser = true;
  //   }, error => {
  //     this.isValidUser = false;
  //   }, () => {
  //   });
  // }

  // routeToRegister() {
  //   this.router.navigateByUrl('auth/register');
  // }

  // resetFormFields() {
  //   this.loginForm.reset();
  // }
  // }
} 