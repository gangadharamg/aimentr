import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse, HttpHeaders
} from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { Subject } from 'rxjs'
import { EncrDecrService } from './encr-decr.service'
import { NgxSpinnerService } from "ngx-spinner";



@Injectable({
  providedIn: 'root'
})
export class CommonService {

  authToken: any;
  httpClient: any;

  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private EncrDecrService: EncrDecrService,
    private spinner: NgxSpinnerService) { }

    getRoles(){
      const roles = {
        admin : 1,
        student : 2,
        mentor : 3
      };
      return roles;
    }
    getCourseMode(){
      const Mode = {
        published : '0',
        save : '1',
      };
      return Mode;
    }


  getHeaders() {
    const options = { headers: {} };
    options.headers['Content-Type'] = 'application/json';
    options.headers['Access-Control-Allow-Origin'] = '*';

    if (this.isLoggedIn()) {
      // console.log("coming here:: ", this.authToken);
      options.headers['Authorization'] = this.authToken;
    }
    return options;
  }



  loginOrRegister(url, data): Observable<Object> {
    this.spinner.show();
    return this.http.post(url, data, this.getHeaders()).pipe(
      map((response: Data) => {
        this.spinner.hide();
        console.log(response);
        if (response.token) {
          localStorage.setItem('jwtToken', response.token);
          var encriptedUserInfo = JSON.stringify(response.user);
          localStorage.setItem('userInfo', this.EncrDecrService.set(encriptedUserInfo));

        }

        return response

      })
    );
  }


  isLoggedIn() {
    this.loadToken()
    return !!localStorage.getItem('userInfo');
  }

  loadToken() {
    const token = localStorage.getItem('jwtToken');
    this.authToken = token;
  }





  getUserDetails(prop) {
    // if (this.isLoggedIn() && !isNullOrUndefined(localStorage.getItem('userInfo')) && localStorage.getItem('userInfo') != 'undefined') {
    //   // const userDetails = JSON.parse(this.cookieSrv.get('userInfo'));
    //   const userDetails =   JSON.parse( this.EncrDecrService.get(localStorage.getItem('userInfo')) );
    //   if (prop === 'all') {
    //     return userDetails;
    //   } else {
    //     return !isNullOrUndefined(userDetails[prop]) ? userDetails[prop] : null;
    //   }
    // } else {
    //   return null;
    // }
  }


  postMethod(url, data): Observable<Object> {
    this.spinner.show();
    return this.http.post(url, data, this.getHeaders()).pipe(
      map((response: Data) => {
        this.spinner.hide();
        return response
      })
    );
  }

  getMethod(url): Observable<Object> {
    this.spinner.show();
    return this.http.get(url, this.getHeaders()).pipe(map(response => {
      this.spinner.hide();
      return response
    }))
  }

  postMethodWithoutLoader(url, data): Observable<Object> {
    return this.http.post(url, data, this.getHeaders()).pipe(
      map((response: Data) => {
        return response
      })
    );
  }

  getuserInfo() {
    if (this.isLoggedIn() && !isNullOrUndefined(localStorage.getItem('userInfo')) && localStorage.getItem('userInfo') != 'undefined') {
      const userDetails = JSON.parse(this.EncrDecrService.get(localStorage.getItem('userInfo')));
      return userDetails;
    } else {
      return null;
    }
  }



  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userInfo');
    this.router.navigate(['/']);

  }


  // createAuthorizationHeader(): HttpHeaders {
  //   this.loadToken();
  //   const headers = new HttpHeaders().set('content-type', 'application/json').set('authorization', this.authToken);
  //   return headers;
  // }






  // Post(url, data): Observable<Object> {
  //   // this.SpinnerService.show();
  //   return this.http.post(url, data).pipe(
  //     map((response: Data) => {

  //       // if (response.auth == false) {
  //       //   alert(response.message);
  //       //   localStorage.setItem("UserLogin", 'fasle');
  //       //   localStorage.setItem('LoginUser', '');
  //       //   localStorage.setItem('token', '');
  //       //   this.router.navigate(['/Login'])
  //       // }
  //       // this.SpinnerService.hide();
  //       return response;
  //     })
  //   );
  // }



  // postMethod(url, data): Observable<Object> {
  //   // this.SpinnerService.show();
  //   return this.http.post(url, data, { headers: this.createAuthorizationHeader() }).pipe(
  //     map((response: Data) => {
  //       // if (response.auth == false) {
  //       //   alert(response.message);
  //       //   localStorage.setItem("UserLogin", 'fasle');
  //       //   localStorage.setItem('LoginUser', '');
  //       //   localStorage.setItem('token', '');
  //       //   this.router.navigate(['/Login'])
  //       // }

  //       // this.SpinnerService.hide();
  //       return response
  //     })
  //   );
  // }


  // getMethod(url): Observable<Object> {
  //   return this.http.get(url).pipe(
  //     map(response => {
  //       return response
  //     })
  //   )
  // }


  // StoreUserData(token) {
  //   localStorage.setItem('token', token);
  //   this.authToken = token;
  // }














}
