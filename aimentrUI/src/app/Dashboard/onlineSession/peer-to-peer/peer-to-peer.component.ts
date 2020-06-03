import { ActivatedRoute, Data } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { environment } from 'src/environments/environment';

import { CommonService } from 'src/app/Services/common.service';
import { APIURL } from 'src/app/url';

var Peer = require('simple-peer');
declare const window: any;


@Component({
  selector: 'app-peer-to-peer',
  templateUrl: './peer-to-peer.component.html',
  styleUrls: ['./peer-to-peer.component.scss']
})
export class PeerToPeerComponent implements OnInit {

  UserInfo;
  private socket;
  client: any = {};
  sessionId: string;
  languages: any[] = [];
  selectedLanguage: string = 'en';
  gt: any;
  recognition;
  subtitles: string = '';

  videoStream: any;

  speechRecongitionStatus = false;
  role: string;
  course_id = "";

  course = {
    courseLevel: ''
  }


  // demoVideoUrl = "https://v3demo.mediasoup.org/?roomId="


  demoVideoUrl = "https://aimentrvideo.herokuapp.com/?userName="

  @ViewChild('firstvideoclick', { static: true }) firstvideoclick: ElementRef;

  constructor(
    // private authSrv: AuthNewService,
    private CommonService: CommonService,
    private route: ActivatedRoute,
  ) {
    this.UserInfo = this.CommonService.getuserInfo();
    route.params.subscribe((p) => {
      this.sessionId = p['id'];

      this.demoVideoUrl += this.UserInfo.username;
      console.log("this.demoVideoUrl", this.demoVideoUrl);

      setTimeout(() => {
        this.firstvideoclick.nativeElement.click();
      }, 500)

    })

    this.route.queryParams.subscribe(params => {
      this.course_id = params.Data;
      this.getcourseInfobyid();
    })
  }

  ngOnInit() {

    this.socket = socketIo(environment.SERVER_URL);
    this.getLanguages();
    this.initVideoSession();

    // this.initVideo();
    this.initSpeechEngine();
    this.subscribeToEvents();


  }
  openFirstVideo(){};
  getcourseInfobyid() {
    var url = APIURL.GET_COURSE_INFO_BY_ID;
    let postData = {
      courseId: this.course_id
    };
    this.CommonService.postMethod(url, postData)
      .subscribe((res: Data) => {
        console.log('res get course by id', res)
        var course = res.data;
        this.course = {
          courseLevel: course.courseLevel
        }
      }, (err) => {
        console.log('err get course by id', err);
      })
  }


  ngOnDestroy(): void {
    if (this.videoStream && this.videoStream.getTracks) {
      this.videoStream.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  }


  subscribeToEvents() {
    this.socket.on('subtitleChanged', (data) => {
      // console.log('SubtitleChanged:: ',data);
      this.translateText('', data.text);
    })
  }

  getLanguages() {
    var url = APIURL.GET_ALL_SUPPORTED_LANGUAGES
    this.CommonService.postMethodWithoutLoader(url, {})
      .subscribe(
        (res: Data) => this.languages = res.data,
        err => this.languages = []
      );
  }




  initVideoSession() {
    let username = this.UserInfo.username;
    let postdata = { username, sessionId: this.sessionId };

    var url = APIURL.IS_ADMIN_FOR_SESSION;
    this.CommonService.postMethod(url, postdata)
      .subscribe((res: Data) => {
        this.role = 'admin';
        console.log("role", res);
        this.initVideo();
      }, err => {
        this.role = 'student';
        console.log("err::  video page join student ", err);
        this.joinVideo();
      })
  }



  joinVideo() {
    // https://v3demo.mediasoup.org/?roomId=tapg245

  }

  initVideo() {

  }






  initSpeechEngine() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 100;
    this.recognition.continuous = true;

    this.recognition.onstart = () => {
      // console.log("Voice activated, you can start talking");
      this.speechRecongitionStatus = true;
    }
    this.recognition.onend = () => {
      // console.log("Voide deactivated");
      this.speechRecongitionStatus = false;
    }
    let finalTranscript = '';
    this.recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;

      let interimTranscript = '';
      for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
        let transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      this.socket.emit('subtitleChanged', { text: interimTranscript });
      // this.translateText(finalTranscript, interimTranscript);

    }

    this.recognition.start();
  }

  translateText(finalTranscript, interimTranscript) {
    if (this.selectedLanguage == 'en') {
      this.subtitles = interimTranscript;
    } else {
      let postdata = {
        text: interimTranscript,
        targetLang: this.selectedLanguage,
        sourceLang: 'en'
      }
      var url = APIURL.TRANSLATE_TEXT
      this.CommonService.postMethodWithoutLoader(url, postdata)
        .subscribe((res: Data) => {
          this.subtitles = res.data.translatedText;
        }, err => console.log(err));
    }
  }

  talk() {
    this.recognition.start();
  }

  mute() {
    this.recognition.stop();
  }

  toggleVideo(event) {
    console.log("Event:: ", event);
  }

}
