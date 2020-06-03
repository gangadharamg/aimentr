import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, NgModel } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';
import { EncrDecrService } from '../../Services/encr-decr.service'
import { APIURL } from '../../url';
import { ToastrService } from 'ngx-toastr';

enum roles {
  admin = 1,
  student = 2,
  mentor = 3
}
@Component({
  selector: 'app-mentorship-registration',
  templateUrl: './mentorship-registration.component.html',
  styleUrls: ['./mentorship-registration.component.scss']
})
export class MentorshipRegistrationComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  YearsOfExperiance = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
  GraduationYear = []


  Payload = {
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    role: "",
    signInMethod: "",
    profileUpdated: false,
    isActive: false,
    verified: true,

    personal: {
      gender: "",
      mobile: null,
      about: "",
      dob: "",
      location: "",
      mail: "",
      // name: ""
    },

    work: {
      experienceLevel: "",
      experiences: [],
      context: "",
      yearsOfExperience: ""
    },

    education: {
      college: "",
      degree: "",
      graduationYear: null,
      skills: ""
    },

    analysis: {},
    training: {},
    mentor: {
      timings: {
        start: "",
        end: ""
      },
      languagesTeach: [],
      context: "",
      classification: [],
      jobType: "",
      avgCost: "",
    },

    learningAssets: {
      interestedAreas: [],
      financialAid: false,
      isOpportunities: false,
      opportunityType: ""
    }
  }


  UrlData;
  ExtractedData = {
    username: "",
    Email: "",
    MobileNumber: null,
    Context: null,
    Company: null,
    Experience: [],
    role: null
  }


  ProgrammingLanguages = [
    { language: "Python", selected: false },
    { language: "Angular", selected: false },
    { language: "AngularJS", selected: false },
    { language: "NodeJs", selected: false },
    { language: "Deep Learning", selected: false },
    { language: "Machine Learning", selected: false },
    { language: "Devops", selected: false },
    { language: "Html5", selected: false },
    { language: "CSS", selected: false }
  ]

  SelectedprogrammingLanguage = "";
  SelectedprogrammingLanguages = [];




  constructor(private _formBuilder: FormBuilder,
    private CommonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private EncrDecrService: EncrDecrService,
    private toastr: ToastrService, ) {
    var currentYear = new Date().getFullYear()
    for (let index = 1990; index <= currentYear; index++) {
      this.GraduationYear.push(index);
    }
    this.GraduationYear.reverse();
    console.log(this.GraduationYear);

    this.route.queryParams.subscribe(params => {
      // console.log(params.Data)
      var DecriptedData = this.EncrDecrService.get(params.Data);
      this.UrlData = JSON.parse(DecriptedData);
      this.ExtractedData = {
        username: this.UrlData.username,
        Email: this.UrlData.Email,
        MobileNumber: this.UrlData.MobileNumber,
        Context: this.UrlData.Context,
        Company: this.UrlData.Company,
        Experience: this.UrlData.Experience,
        role: this.UrlData.role
      };
      console.log("UrlData", this.UrlData);

      this.urlDataAssignedToPayload()

    })
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  urlDataAssignedToPayload() {
    this.Payload.email = this.ExtractedData.Email;
    this.Payload.username = this.ExtractedData.username;
    this.Payload.role = this.ExtractedData.role;
    this.Payload.personal.mail = this.ExtractedData.Email;
    this.Payload.personal.mobile = this.ExtractedData.MobileNumber;

    this.Payload.work.experiences = this.ExtractedData.Experience;
    this.Payload.work.context = this.ExtractedData.Context;

  }

  personalToWork() {
    console.log(this.Payload);
  }

  addProgrammings() {
    this.SelectedprogrammingLanguages = [];

    this.ProgrammingLanguages.forEach(lng => {
      if (lng.language == this.SelectedprogrammingLanguage) {
        lng.selected = true;
      }
    })

    this.SelectedprogrammingLanguages = this.ProgrammingLanguages.filter(lng => lng.selected == true)

    console.log(this.SelectedprogrammingLanguages);
    console.log("this.ProgrammingLanguages", this.ProgrammingLanguages);
  }


  RemoveFromSelectedProgrammingLanguage(item) {
    this.SelectedprogrammingLanguages = [];
    this.ProgrammingLanguages.forEach(lng => {
      if (lng.language == item.language) {
        lng.selected = false;
      }
    });
    this.SelectedprogrammingLanguages = this.ProgrammingLanguages.filter(lng => lng.selected == true)
  }




  OnSubmitRegistrationForm() {
    this.SelectedprogrammingLanguages.forEach(lang => {
      var obj = {
        language: lang.language
      }
      this.Payload.mentor.languagesTeach.push(obj);
    })


    console.log(this.Payload);


    var url = APIURL.AUTH_REGISTER_USER;
    this.CommonService.loginOrRegister(url, this.Payload)
      .subscribe((data: Data) => {
        console.log("Data===>", data);
        if (data.success) {

          this.toastr.success(data.msg, "Success !");
          this.router.navigate(['/home/mentor/dashboard'])

        }
        else {
          this.toastr.warning(data.msg, "Error !");
        }
      })



  }




}
