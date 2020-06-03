import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, NgModel } from '@angular/forms';
import { CommonService } from '../../Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';
import { EncrDecrService } from '../../Services/encr-decr.service'
import { APIURL } from '../../url';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse, HttpHeaders
} from '@angular/common/http';

import { MdbBtnDirective, ModalDirective } from 'angular-bootstrap-md';


@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {

  // viewstep = "4";
  // SessionType = "Online";
  viewstep = "1";
  SessionType = "";

  EditMode = false;

  userInfo;

  Payload = {
    mentor: "",
    courseId: null,
    courseName: "",
    subtitle: "",
    courseMode: "",
    prerequisites: "",
    cost: null,
    description: "",
    courseType: "",
    courseLevel:"",
    duration: "",
    skillLevel: "",
    baches: [],
    // topics: [],
    // timings: {  // only online sessions
    //   start: {
    //     hour: null,
    //     minute: null,
    //     second: null
    //   },
    //   end: {
    //     hour: null,
    //     minute: null,
    //     second: null
    //   }
    // },

    startDate: null,
    endDate: null,
    tags: [""],
    skills: [""],

  }

  OnlineCourseBaches = [];
  NumberOfStudentsList = [];

  AddTopicObj = {
    uniqueId: null,
    title: '',
    subTopics: []
  }

  AddSubtopic = {
    uniqueId: null,
    title: "",
    url: "",
    provider: "",
    programming: false
  }


  UrlData;
  CourseDetails = {
    mentor: "",
    courseId: null,
    // _id: null,
    courseName: "",
    courseType: "",
    skillLevel: "",
  }


  AllTopics = [];
  AllSubtopics = [];

  addCourseTopics = {
    mentor: "",
    courseId: null,
    courseName: "",
    topicName: "",
  }


  addCourseSubTopics = {
    mentor: "",
    courseId: null,
    topicId: null,
    topicName: "",
    subTopicName: ""
  }

  topicAlteadySelected = false;

  EditTopicId = null;
  EditSubTopicId = null;

  courseMode = '1'

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.AllTopics, event.previousIndex, event.currentIndex);
  }

  dropSubtopics(event: CdkDragDrop<string[]>, item) {
    moveItemInArray(item.SubTopicsData, event.previousIndex, event.currentIndex);
  }


  filesToUpload: Array<File> = [];


  SelectedTopicForDeleting = {
    topicId: null,
    topicName: ""
  }
  SelectedSubTopicForDeleting = {
    subTopicId: null,
    subTopicName: ""
  }

  @ViewChild('AddTopicModal', { static: true }) AddTopicModal: ModalDirective
  @ViewChild('AddSubTopicModal', { static: true }) AddSubTopicModal: ModalDirective


  constructor(
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    private CommonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private EncrDecrService: EncrDecrService,
    private toastr: ToastrService,
  ) {


    for (let index = 1; index <= 50; index++) {
      this.NumberOfStudentsList.push(index);
    }

    this.userInfo = this.CommonService.getuserInfo();
    console.log("==", this.userInfo)
    this.Payload.mentor = this.userInfo.email;


    this.route.queryParams.subscribe(params => {
      console.log(params.Data)
      if (params.Data) {
        var DecriptedData = this.EncrDecrService.get(params.Data);
        this.UrlData = JSON.parse(DecriptedData);
        this.CourseDetails = {
          mentor: this.UrlData.mentor,
          // _id: this.UrlData._id,
          courseId: this.UrlData.courseId,
          courseName: this.UrlData.courseName,
          courseType: this.UrlData.courseType,
          skillLevel: this.UrlData.skillLevel,
        };
        this.viewstep = '4';
        console.log("UrlData", this.UrlData);

        // this.GetCoursesOfMentor()
        this.GetTopicsList();
      }

      if (params.EditData) {
        var DecriptedData = this.EncrDecrService.get(params.EditData);
        this.UrlData = JSON.parse(DecriptedData);
        var EditCourse = {
          mentor: this.UrlData.mentor,
          courseId: this.UrlData.courseId,
          courseName: this.UrlData.courseName,
        };
        this.viewstep = '1';
        console.log("UrlData", this.UrlData);
        this.GetCourse(EditCourse);
      }

    })
  }

  ngOnInit() {

  }


  GetCourse(item) {
    var obj = {
      courseId: item.courseId,
    }
    var url = APIURL.GET_ALL_COURSES_OF_MENTOR;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          var EditCourse = data.Data[0];

          this.SessionType = EditCourse.courseType;
          this.EditMode = true;
          this.Payload = {
            mentor: this.userInfo.email,
            courseId: EditCourse.courseId,
            courseName: EditCourse.courseName,
            courseMode: EditCourse.courseMode,
            subtitle: EditCourse.subtitle,
            prerequisites: EditCourse.prerequisites,
            cost: EditCourse.cost,
            description: EditCourse.description,
            courseType: EditCourse.courseType,
            courseLevel:EditCourse.courseLevel,
            duration: EditCourse.duration,
            skillLevel: EditCourse.skillLevel,
            baches: EditCourse.baches,
            // topics: EditCourse.topics,
            // timings: {  // only online sessions
            //   start: {
            //     hour: null,
            //     minute: null,
            //     second: null
            //   },
            //   end: {
            //     hour: null,
            //     minute: null,
            //     second: null
            //   }
            // },
            startDate: EditCourse.startDate,
            endDate: EditCourse.endDate,
            tags: EditCourse.tags,
            skills: EditCourse.skills,

          }

          this.OnlineCourseBaches = [];
          EditCourse.baches.forEach(batch => {
            var obj = {
              EditMode: true,
              bachname: batch.bachname,
              numberOfPeople: batch.numberOfPeople,
            }
            this.OnlineCourseBaches.push(obj);
          })

        }
      })

  }

  setCoursetype() {
    this.Payload.courseType = this.SessionType;
    this.viewstep = '2';

    if (this.Payload.courseType == 'Online') {
      if (this.OnlineCourseBaches.length == 0) {
        this.AddBatch()
      }
    }
  }


  AddBatch() {
    var obj = {
      EditMode: false,
      bachname: "",
      numberOfPeople: ''
    }
    this.OnlineCourseBaches.push(obj);
  }

  DeleteBatch(item , i){
    this.OnlineCourseBaches.forEach((x , index)=>{
      if(index == i){
        this.OnlineCourseBaches.splice(i , 1);
      }
    })
  }



  aboutThisCourse(value) {
    console.log("this.Payload==>", this.Payload);
    this.Payload.baches = [];
    this.OnlineCourseBaches.forEach(batch => {
      var obj = {
        bachname: batch.bachname,
        numberOfPeople: batch.numberOfPeople,
      }
      this.Payload.baches.push(obj);
    })

    this.Payload.courseMode = this.courseMode
    
    if (this.EditMode || value == true) {
      var url = APIURL.UPDATE_COURSE;
    } else {
      var url = APIURL.ADD_COURSE;
    }

    this.CommonService.postMethod(url, this.Payload)
      .subscribe((data: Data) => {
        console.log("Data===>", data);
        if (data.Success) {
          if(value == true){
            this.router.navigate(['/home/mentor/dashboard']);
          }else{
           
          this.toastr.success(data.Message, "Success !");
          // this.viewstep = '4';
          if (this.EditMode) {
            var CourseData = {
              mentor: this.Payload.mentor,
              courseId: this.Payload.courseId,
              courseName: this.Payload.courseName,
              courseType: this.Payload.courseType,
              skillLevel: this.Payload.skillLevel,
              // _id: data.Data._id,
            }
          } else {
            var CourseData = {
              mentor: this.Payload.mentor,
              courseId: data.Data.courseId,
              courseName: this.Payload.courseName,
              courseType: this.Payload.courseType,
              skillLevel: this.Payload.skillLevel,
              // _id: data.Data._id,
            }
          }
          var StringifyedData = JSON.stringify(CourseData);
          var EncriptedData = this.EncrDecrService.set(StringifyedData);
          this.router.navigate(['/home/courseupload'], { queryParams: { Data: EncriptedData } });
 
        }

        }
        else {
          this.toastr.warning(data.msg, "Error !");
        }
      })
  }




  dontUpdateNext() {
    var CourseData = {
      mentor: this.Payload.mentor,
      courseId: this.Payload.courseId,
      courseName: this.Payload.courseName,
      courseType: this.Payload.courseType,
      skillLevel: this.Payload.skillLevel,
      // _id: data.Data._id,
    }
    var StringifyedData = JSON.stringify(CourseData);
    var EncriptedData = this.EncrDecrService.set(StringifyedData);
    this.router.navigate(['/home/courseupload'], { queryParams: { Data: EncriptedData } });
  }


  // coursebackfromLast() {
  //   this.router.navigate(['/home/courseupload'], { queryParams: {} });
  //   this.viewstep = '3';
  // }


  GetTopicsList() {
    var obj = {
      mentor: this.CourseDetails.mentor,
      courseId: this.CourseDetails.courseId
    }
    var url = APIURL.GET_TOPICS_OF_COURSE;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        console.log("AllTopics===>", data);
        if (data.Success) {
          this.AllTopics = data.Data;

          this.AllTopics.forEach(topic => {
            topic.SubTopicsData = [];
          })
          this.GetSubTopicsList();
        }

      })
  }

  GetSubTopicsList() {
    var obj = {
      mentor: this.CourseDetails.mentor,
      courseId: this.CourseDetails.courseId
    }
    var url = APIURL.GET_SUB_TOPICS_OF_COURSE;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        console.log("AllSubtopics===>", data);
        if (data.Success) {
          this.AllSubtopics = data.Data;

          this.AllTopics.forEach(topic => {
            topic.SubTopicsData = [];
            this.AllSubtopics.forEach(subtopic => {
              if (topic.topicId == subtopic.topicId) {
                topic.SubTopicsData.push(subtopic);
              }
            })
          })

          console.log(" this.AllTopics", this.AllTopics)



        }
      })
  }

  OpenAddTopicPop() {
    this.EditTopicId = null;
    this.addCourseTopics.topicName = "";
  }



  AddTopics() {
    this.addCourseTopics = {
      mentor: this.CourseDetails.mentor,
      courseId: this.CourseDetails.courseId,
      courseName: this.CourseDetails.courseName,
      topicName: this.addCourseTopics.topicName,
    }

    var url = APIURL.ADD_TOPICS_OF_COURSE;
    this.CommonService.postMethod(url, this.addCourseTopics)
      .subscribe((data: Data) => {
        console.log("addCoursetopic===>", data);
        if (data.Success) {
          this.addCourseTopics.topicName = "";
          this.toastr.success("Topic added successfully!", "Success !");
          this.GetTopicsList();
        }
      })

  }

  changeTopic() {
    this.AllTopics.forEach(topic => {
      if (topic.topicId == this.addCourseSubTopics.topicId) {
        this.addCourseSubTopics.topicName = topic.topicName;
      }
    })
  }

  openaddsubtopics() {
    this.topicAlteadySelected = false;
    this.EditSubTopicId = null;
    this.addCourseSubTopics.subTopicName = "";
  }

  SelectTopicForSubtopics(item) {
    this.addCourseSubTopics.topicId = item.topicId;
    this.addCourseSubTopics.topicName = item.topicName;

    this.topicAlteadySelected = true;

    this.EditSubTopicId = null;
    this.addCourseSubTopics.subTopicName = "";
  }



  AddSubTopics() {
    this.addCourseSubTopics.mentor = this.CourseDetails.mentor;
    this.addCourseSubTopics.courseId = this.CourseDetails.courseId;

    var url = APIURL.ADD_SUB_TOPICS_OF_COURSE;
    this.CommonService.postMethod(url, this.addCourseSubTopics)
      .subscribe((data: Data) => {
        console.log("addsubtopiccourse===>", data);
        if (data.Success) {
          this.addCourseSubTopics.subTopicName = "";
          this.toastr.success("SubTopic added successfully!", "Success !");
          this.GetSubTopicsList();
        }
      })
  }



  EditTopic(item) {
    this.EditTopicId = item.topicId
    this.addCourseTopics.topicName = item.topicName
  }

  UpdateTopic() {
    var obj = {
      topicId: this.EditTopicId,
      topicName: this.addCourseTopics.topicName,
    }

    var url = APIURL.UPDATE_TOPIC_NAMES_OF_COURSE;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        console.log("Updated topic===>", data);
        if (data.Success) {
          if (data.Other.Success) {
            this.AddTopicModal.hide();
            this.EditTopicId = null;
            this.addCourseTopics.topicName = "";
            this.toastr.success(data.Message, "Success !");
            this.GetTopicsList();
          } else {
            this.toastr.warning(data.Message, "Error !");
          }

        }
      })
  }

  EditSelectedSubTopic(Subitem) {
    this.EditSubTopicId = Subitem.subTopicId;
    this.addCourseSubTopics.subTopicName = Subitem.subTopicName;
    this.addCourseSubTopics.topicId = Subitem.topicId;
    this.addCourseSubTopics.topicName = Subitem.topicName;

    this.topicAlteadySelected = true;
  }

  UpdateSubTopic() {
    var obj = {
      subTopicId: this.EditSubTopicId,
      subTopicName: this.addCourseSubTopics.subTopicName,
    }

    var url = APIURL.UPDATE_SUB_TOPIC_NAMES_OF_COURSE;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        console.log("Updated topic===>", data);
        if (data.Success) {
          if (data.Other.Success) {
            this.AddSubTopicModal.hide();
            this.EditSubTopicId = null;
            this.addCourseSubTopics.subTopicName = "";
            this.toastr.success(data.Message, "Success !");
            this.GetSubTopicsList();
          } else {
            this.toastr.warning(data.Message, "Error !");
          }

        }
      })
  }





  fileChangeEvent(fileInput: any, Subitem) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.VideoUpload(Subitem);
  }

  VideoUpload(Subitem) {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    formData.append("uploads[]", files[0], files[0]['name']);
    formData.append("subTopicId", Subitem.subTopicId);

    var url = APIURL.UPDATE_SUB_TOPIC_VIDEO_URL;
    this.http.post(url, formData).subscribe(
      (response: Data) => {
        console.log(response);
        if (response.Status == 200) {
          if (response.Other.Success == true) {
            this.toastr.success("Video added successfully!", "Success !");
          } else {
            this.toastr.warning("Video Uploading Failed!", "Error !");
          }
        } else {
          this.toastr.error(response.Message, "Error !");
        }

      }
    )

    // this.CommonService.postMethod(url, formData)
    //   .subscribe((data: Data) => {
    //     console.log("videoUrl" , data)
    //     if (data.Status == 200) {

    //     }
    //   })
  }



  UpdateProgramStatus(Subitem) {

    var obj = {
      subTopicId: Subitem.subTopicId,
      programming: Subitem.programming
    }
    console.log(Subitem)
    var url = APIURL.UPDATE_SUB_TOPIC_PROGRAMMING_STATUS;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        console.log("Programming", data)
        if (data.Status == 200) {
          if (data.Other.Success == true) {
            this.toastr.success("Programming Editor added successfully!", "Success !");
          } else {
            this.toastr.warning("Programming Editor Adding Failed!", "Error !");
          }
        } else {
          this.toastr.error(data.Message, "Error !");
        }
      })




  }






  ChooseDeleteTopic(item) {
    this.SelectedTopicForDeleting = {
      topicId: item.topicId,
      topicName: item.topicName,
    }
  }


  DeleteTopics() {
    var obj = {
      topicId: this.SelectedTopicForDeleting.topicId,
    }
    var url = APIURL.DELETE_TOPICS_NAMES_OF_COURSE;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        console.log("Programming", data)
        if (data.Status == 200) {
          if (data.Other.Success == true) {
            this.toastr.success(data.Message, "Success !");
            this.GetTopicsList();
          } else {
            this.toastr.warning(data.Message, "Error !");
          }
        } else {
          this.toastr.error(data.Message, "Error !");
        }
      })
  }




  ChooseDeleteSubTopic(item) {
    this.SelectedSubTopicForDeleting = {
      subTopicId: item.subTopicId,
      subTopicName: item.subTopicName,
    }
  }


  DeleteSubTopics() {
    var obj = {
      subTopicId: this.SelectedSubTopicForDeleting.subTopicId,
    }
    var url = APIURL.DELETE_SUB_TOPIC_NAMES_OF_COURSE;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        console.log("Programming", data)
        if (data.Status == 200) {
          if (data.Other.Success == true) {
            this.toastr.success(data.Message, "Success !");
            this.GetSubTopicsList();
          } else {
            this.toastr.warning(data.Message, "Error !");
          }
        } else {
          this.toastr.error(data.Message, "Error !");
        }
      })
  }






}
