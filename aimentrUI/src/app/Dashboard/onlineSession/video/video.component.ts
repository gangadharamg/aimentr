import { ActivatedRoute, Data } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { environment } from 'src/environments/environment';

import { CommonService } from 'src/app/Services/common.service';
import { APIURL } from 'src/app/url';

var Peer = require('simple-peer');
declare const window: any;

@Component({
  selector: 'app-live-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class LiveVideoComponent implements OnInit {
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

  constructor(
    // private authSrv: AuthNewService,
    private CommonService: CommonService,
    private route: ActivatedRoute,
  ) {
    this.UserInfo = this.CommonService.getuserInfo();
    route.params.subscribe((p) => {
      this.sessionId = p['id'];
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

    const video = document.querySelector('video');
    this.socket.emit('NewClient');

    let InitPeer = (type) => {
      let peer = new Peer()
      peer.on('stream', (stream) => {
        console.log("Stream:: ", stream);
        video.srcObject = stream;
        peer.addStream(stream);
        video.play();
      })
      peer.on('data', (data) => {
        let decodedData = new TextDecoder('utf-8').decode(data)
      })
      peer._debug = console.log
      return peer
    }

    //for peer of type init
    let MakePeer = () => {
      this.client.gotAnswer = false
      let peer = InitPeer('init')
      peer.on('signal', (data) => {
        console.log("Client Signal Data:: ", data);
        if (!this.client.gotAnswer) {
          this.socket.emit('Offer', data)
        }
      })

      this.client.peer = peer;

    };MakePeer();


    //for peer of type not init
    let FrontAnswer = (offer) => {
      let peer = InitPeer('notInit')
      peer.on('signal', (data) => {
        this.socket.emit('Answer', data)
      })

      peer.signal(offer)

      this.client.peer = peer
    }


    let SignalAnswer = (answer) => {
      this.client.gotAnswer = true
        let peer = this.client.peer
        peer.signal(answer)
    }

    let SendFilter = (filter) => {
      if (this.client.peer) {
        this.client.peer.send(filter)
      }
    }

    let RemovePeer = () => {
      if (this.client.peer) {
        this.client.peer.destroy()
      }
    }


    this.socket.on('BackOffer', FrontAnswer)
    this.socket.on('BackAnswer', SignalAnswer)
    // this.socket.on('SessionActive', SessionActive)
    // this.socket.on('CreatePeer', MakePeer)
    this.socket.on('Disconnect', RemovePeer)
  }

  initVideo() {


    const video = document.querySelector('video');
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        this.videoStream = stream;
        this.socket.emit('NewClient');
        video.srcObject = stream
        video.play();

        function InitPeer(type) {
          let peer = new Peer({ initiator: (type == 'init') ? true : false, stream: stream, 
          iceTransportPolicy: 'all', 
          trickle: false })
          peer.on('stream', function (stream) {
            // CreateVideo(stream)
            console.log("steram created", stream)
          })

          return peer;
        }

        var MakePeer = () => {
          this.client.gotAnswer = false
          let peer = InitPeer('init')
          peer.on('signal', (data) => {
            if (!this.client.gotAnswer) {
              this.socket.emit('Offer', data)
            }
          })
          this.client.peer = peer;
          console.log("Coming here..", this.client);
        };MakePeer();


        var FrontAnswer = (offer) => {
          let peer = InitPeer('notInit')
          peer.on('signal', (data) => {
            console.log("==============>", data)
            this.socket.emit('Answer', data)
          })
          console.log("Sending offer", offer);
          peer.signal(offer)
          this.client.peer = peer
        }


        var SignalAnswer = (answer) => {
          this.client.gotAnswer = true
          let peer = this.client.peer
          peer.signal(answer)
        }

        var SendFilter = (filter) => {
          if (this.client.peer) {
            this.client.peer.send(filter)
          }
        }

        var RemovePeer = () => {
          if (this.client.peer) {
            this.client.peer.destroy()
          }
        }

        this.socket.on('BackOffer', FrontAnswer)
        this.socket.on('BackAnswer', SignalAnswer)
        // this.socket.on('CreatePeer', MakePeer)
        this.socket.on('Disconnect', RemovePeer)
      })
      .catch(err => {
        console.log("ERR:: ", err);
      })

    // getUserMedia({ video: false, audio: false }, (err, stream) => {
    //   this.socket.emit('NewClient')
    //   video.srcObject = stream
    //   video.play();

    //   console.log("Connected:: ",err);

    //   // //used to initialize a peer
    //   function InitPeer(type) {
    //     let peer = new Peer({ initiator: (type == 'init') ? true : false, stream: stream, trickle: false })
    //     peer.on('stream', function (stream) {
    //       // CreateVideo(stream)
    //     })
    //     peer.on('data', function (data) {
    //       let decodedData = new TextDecoder('utf-8').decode(data)
    //       console.log("Decoded data:: ",decodedData);
    //       // let peervideo = document.querySelector('#peerVideo')
    //       // peervideo.style.filter = decodedData
    //     })
    //     return peer
    //   }

    //   // //for peer of type init
    //   function MakePeer() {
    //     this.client.gotAnswer = false
    //     let peer = InitPeer('init')
    //     peer.on('signal', function (data) {
    //       if (!this.client.gotAnswer) {
    //         this.socket.emit('Offer', data)
    //       }
    //     })
    //     this.client.peer = peer
    //   }

    //   // //for peer of type not init
    //   function FrontAnswer(offer) {
    //     let peer = InitPeer('notInit')
    //     peer.on('signal', (data) => {
    //       this.socket.emit('Answer', data)
    //     })
    //     peer.signal(offer)
    //     this.client.peer = peer
    //   }

    //   function SignalAnswer(answer) {
    //     this.client.gotAnswer = true
    //     let peer = this.client.peer
    //     peer.signal(answer)
    //   }

    //   function SendFilter(filter) {
    //     if (this.client.peer) {
    //       this.client.peer.send(filter)
    //     }
    //   }

    //   function RemovePeer() {
    //     if (this.client.peer) {
    //       this.client.peer.destroy()
    //     }
    //   }

    //   this.socket.on('BackOffer', FrontAnswer)
    //   this.socket.on('BackAnswer', SignalAnswer)
    //   this.socket.on('CreatePeer', MakePeer)
    //   this.socket.on('Disconnect', RemovePeer)

    // })
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
