import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

declare var $ : any;
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class StepperComponent implements OnInit {
  //   isLinear = false;
  //   firstFormGroup: FormGroup;
  //   secondFormGroup: FormGroup;
  //   stepper: any;
  //   count: number=1;


  //   date = new FormControl(new Date());
  //   serializedDate = new FormControl((new Date()).toISOString());

  //   isEditable = false;

  //   constructor(private _formBuilder: FormBuilder) { }

  //   ngOnInit() {
  //     this.firstFormGroup = this._formBuilder.group({
  //       firstCtrl: ['', Validators.required]
  //     });
  //     this.secondFormGroup = this._formBuilder.group({
  //       secondCtrl: ['', Validators.required]
  //     });
  //   }
  // add(){
  //   this.count++
  // }
  // sub(){
  //   this.count--
  // }
  // reset(){
  //   this.count=0
  // }


  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;


  UserDetails = {
    UserName: "",
    Email: "",
    MobileNumber: null,
    FirstName: "",
    LastName: "",
    Address: ""
  }
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
        firstCtrl: ['', Validators.required]
      });
      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required]
      });


  }



}
