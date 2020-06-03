import { Component } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner"; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'aimentrUI';
  constructor( private SpinnerService: NgxSpinnerService){
    // this.SpinnerService.show();  

  }
}
