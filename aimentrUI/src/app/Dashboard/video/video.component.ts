import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';
import { EncrDecrService } from '../../Services/encr-decr.service'
import { APIURL } from '../../url';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
  userInfo;
  UrlData;
  ViewCourse = {
    mentor: "",
    courseId: null,
    courseName: "",
    prerequisites: "",
    cost: null,
    description: "",
    courseType: "",
    duration: "",
    skillLevel: "",
    skills: [],
    tags: "",
    startDate: "",
    endDate: ""
  };

  CourseDetails = {
    mentor: "",
    courseId: null,
    courseName: ""
  }

  AllTopics = [];
  AllSubtopics = [];
  AllUserCompletedVideos = [];
  SelectedTopicName = "";

  courseUrldata;

  VideoEnded = 'false';

  FirstvideoUrl = '';

  @ViewChild('videoLinks', { static: true }) videoLinks: ElementRef;
  @ViewChild('firstvideoclick', { static: true }) firstvideoclick: ElementRef;


  constructor(
    private CommonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private EncrDecrService: EncrDecrService,
    private toastr: ToastrService,
    private eleRef: ElementRef
  ) {



    this.userInfo = this.CommonService.getuserInfo();
    console.log("userInfo", this.userInfo);

    this.route.queryParams.subscribe(params => {

      if (params.Data) {
        this.courseUrldata = params.Data;
        var DecriptedData = this.EncrDecrService.get(params.Data);
        this.UrlData = JSON.parse(DecriptedData);
        this.CourseDetails = {
          mentor: this.UrlData.mentor,
          courseId: this.UrlData.courseId,
          courseName: this.UrlData.courseName,
        };
        console.log("UrlData", this.UrlData);
        this.GetSelectedCourse();
      }
    })


  }

  ngOnInit(): void {

    setTimeout(this.SetFrameVideoSize, 500);

  }


  ngAfterViewInit() {
    // let firstvideoclick = this.eleRef.nativeElement.querySelector('#firstvideoclick');
    // firstvideoclick.onclick();


  }

  openFirstVideo() {

  }

  SetFrameVideoSize() {
    localStorage.setItem('VideoEnded', 'false');

    if ($('#myIframe').contents().find("head") != undefined) {
      $('#myIframe')
        .contents()
        .find("head")
        .append(`<style>
        video {
          min-width: 100% !important;
          min-height: 100% !important;
        }
      </style> 
      
      <script>
     var GetvideoplayerTime = setInterval(function () {
        var VideoPlayer = document.getElementsByTagName('video')[0];
        console.log("video player current time" , VideoPlayer.currentTime );

        VideoPlayer.addEventListener('ended', function () {
          console.log("video player video ended---" , 'ended' );
          localStorage.setItem('VideoEnded', 'true');

          clearInterval(GetvideoplayerTime);
         } ,false)

      }, 1000)

      </script>
      
      
      `);
    };
  }


  GetSelectedCourse() {
    var obj = {
      courseId: this.CourseDetails.courseId,
    }
    var url = APIURL.GET_ALL_COURSES_OF_MENTOR;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          var SelectedCourse = data.Data[0];

          this.ViewCourse = {
            mentor: SelectedCourse.mentor,
            courseId: SelectedCourse.courseId,
            courseName: SelectedCourse.courseName,
            prerequisites: SelectedCourse.prerequisites,
            cost: SelectedCourse.cost,
            description: SelectedCourse.description,
            courseType: SelectedCourse.courseType,
            duration: SelectedCourse.duration,
            skillLevel: SelectedCourse.skillLevel,
            skills: SelectedCourse.skills,
            tags: SelectedCourse.tags,
            startDate: SelectedCourse.startDate,
            endDate: SelectedCourse.endDate,
          };

          console.log("GetAvailableCourses===>", this.ViewCourse);
          this.GetTopicsList();

        }
      })
  }



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
          this.GetUserCompletedVideos();
        }

      })
  }


  GetUserCompletedVideos() {
    var obj = {
      email: this.userInfo.email,
      courseId: this.CourseDetails.courseId,
    }
    var url = APIURL.GET_USER_COMPLETED_VIDEOS_OF_THE_COURSE;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        console.log("AllSubtopics===>", data);
        if (data.Success) {
          this.AllUserCompletedVideos = data.Data;
          this.GetSubTopicsList();
        }
      })
  }


  GetSubTopicsList() {
    var obj = {
      mentor: this.CourseDetails.mentor,
      courseId: this.CourseDetails.courseId,
    }
    var url = APIURL.GET_SUB_TOPICS_OF_COURSE;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        console.log("AllSubtopics===>", data);
        if (data.Success) {
          this.AllSubtopics = data.Data;



          // this.AllSubtopics.forEach((subtopic, index) => {
          //   subtopic.videoCompleted = false;
          //   if (index == 0) {
          //     subtopic.videoCompleted = true;
          //   }
          // })

          // this.AllUserCompletedVideos.forEach(completedVideo => {
          //   var OpenNextVideo = 0;
          //   this.AllSubtopics.forEach((subtopic, index) => {
          //     subtopic.videoCompleted = false;
          //     if (completedVideo.subTopicId == subtopic.subTopicId) {
          //       subtopic.videoCompleted = true;
          //       OpenNextVideo = index + 1;
          //     }

          //     if (OpenNextVideo == index) {
          //       subtopic.videoCompleted = true;
          //     }
          //   })
          // })




          this.AllTopics.forEach(topic => {
            topic.SubTopicsData = [];
            this.AllSubtopics.forEach(subtopic => {
              subtopic.videoCompleted = false;
              subtopic.videoRunning = false;
              if (topic.topicId == subtopic.topicId) {
                topic.SubTopicsData.push(subtopic);
              }
            })
          })



          var topicIndexUp = null;
          this.AllTopics.forEach((topic, topicindex) => {
            topic.videosCompletedCount = 0;

            topic.SubTopicsData.forEach((subtopic, index) => {
              if (index == 0 && topicindex == 0) {
                // subtopic.videoCompleted = true;
                subtopic.videoRunning = true;
                this.FirstvideoUrl = subtopic.videoUrl;
                setTimeout(() => {
                  if (this.FirstvideoUrl != '' && this.FirstvideoUrl != undefined) {
                    this.firstvideoclick.nativeElement.click();
                    setTimeout(() => {
                      this.SetFrameVideoSize();
                    }, 500)
                  }
                }, 500)

              }
              this.AllUserCompletedVideos.forEach(completedVideo => {
                if (completedVideo.subTopicId == subtopic.subTopicId) {
                  subtopic.videoCompleted = true;
                }
              })
            });


            topic.SubTopicsData.forEach((subtopic, index) => {
              if (subtopic.videoCompleted) {
                topic.videosCompletedCount++
              }
            });



            if (topic.videosCompletedCount == topic.SubTopicsData.length) {
              topicIndexUp = topicindex + 1;
            }
            if (topicIndexUp == topicindex) {
              topic.SubTopicsData.forEach((subtopic, index) => {
                if (index == 0) {
                  subtopic.videoRunning = true;
                }
              })
            }


            var OpenNextVideo = null;
            topic.SubTopicsData.forEach((subtopic, index) => {
              if (subtopic.videoCompleted) {
                OpenNextVideo = index + 1;
              }
              if (OpenNextVideo == index) {
                subtopic.videoRunning = true;
              }
            })

          })


          // this.AllTopics.forEach((topic, topicindex) => {
          //   topic.videosCompletedCount = 0;
          //   topic.SubTopicsData.forEach((subtopic, index) => {
          //     if (subtopic.videoCompleted) {
          //       topic.videosCompletedCount++
          //     }
          //   });
          // })


          // var topicIndexUp = null;
          // this.AllTopics.forEach((topic, topicindex) => {
          //   if (topic.videosCompletedCount == topic.SubTopicsData.length) {
          //     topicIndexUp = topicindex + 1;
          //   }

          //   if (topicIndexUp == topicindex) {
          //     topic.SubTopicsData.forEach((subtopic, index) => {
          //       if (index == 0) {
          //         subtopic.videoCompleted = true;
          //       }
          //     })
          //   }
          // })


          // this.AllTopics.forEach((topic, topicindex) => {
          //   var OpenNextVideo = null;
          //   topic.SubTopicsData.forEach((subtopic, index) => {
          //     if (subtopic.videoCompleted) {
          //       OpenNextVideo = index + 1;
          //     }
          //     if (OpenNextVideo == index) {
          //       subtopic.videoCompleted = true;
          //     }
          //   })
          // });


          console.log(" this.AllTopics", this.AllTopics)

        }




      })
  }





  CheckVideoEnded;
  SelectedVideo(subItem) {

    clearInterval(this.CheckVideoEnded);
    setTimeout(this.SetFrameVideoSize, 500);
    this.VideoEnded = 'false';

    this.CheckVideoEnded = setInterval(() => {
      this.VideoEnded = localStorage.getItem('VideoEnded');

      console.log("this.VideoEnded", this.VideoEnded)

      if (this.VideoEnded == 'true') {
        console.log("video ended !!!!");
        clearInterval(this.CheckVideoEnded);

        this.SaveCompletedVideos(subItem);

      }
    }, 1000);

  }



  SaveCompletedVideos(item) {
    var obj = {
      email: this.userInfo.email,
      courseId: item.courseId,
      topicId: item.topicId,
      topicName: item.topicName,
      subTopicId: item.subTopicId,
      subTopicName: item.subTopicName
    }
    var url = APIURL.ADD_USER_COMPLETED_VIDEOS_OF_THE_COURSE;
    this.CommonService.postMethod(url, obj)
      .subscribe((data: Data) => {
        console.log("video Completed===>", data);
        if (data.Success) {
          if (data.Other.Success) {
            this.toastr.success(data.Message, 'Success!');
            this.GetUserCompletedVideos();
          } else {
            this.toastr.success(data.Message, 'Success!');
          }
        }
      })
  }







  // playerControls() {
  // return  setInterval(function () {
  //     var VideoPlayer = document.getElementsByTagName('video')[0];
  //     console.log("video player current time", VideoPlayer.currentTime);

  //     VideoPlayer.addEventListener('ended', function () {
  //       console.log("video player video ended---", 'ended');
  //     }, false)

  //   }, 1000)
  // }







}

