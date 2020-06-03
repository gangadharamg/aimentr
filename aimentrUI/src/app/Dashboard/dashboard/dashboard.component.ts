import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';
import { APIURL } from '../../url';
import { DataService } from "../../Services/share-data.service";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  Student = false;
  roles;
  userInfo;

  defaultFilter = 'Mentors'

  constructor(private CommonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private DataService: DataService, ) {
    this.userInfo = this.CommonService.getuserInfo();
    this.roles = this.CommonService.getRoles();
    if (this.roles.student == this.userInfo.role) {
      this.Student = true;
    }

    localStorage.setItem('defaultFilter', this.defaultFilter);
  }

  ngOnInit(): void {
   
  }

  mydashboard() {
    if (this.Student) {
      this.router.navigate(['/home/student/dashboard']);
    } else {
      this.router.navigate(['/home/mentor/dashboard']);
    }
  }

  logoutnow() {
    this.CommonService.logout();
  }


  setFilters(item){
    localStorage.setItem('defaultFilter', item);

    this.DataService.changeMessage('chengeFilter');

  }

}
