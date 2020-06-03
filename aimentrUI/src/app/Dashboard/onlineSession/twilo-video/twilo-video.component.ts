import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from 'src/app/Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';
import { EncrDecrService } from 'src/app/Services/encr-decr.service'
import { APIURL } from 'src/app/url';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'angular-bootstrap-md';
import * as socketIo from 'socket.io-client';
import Video from 'twilio-video';
import { environment } from 'src/environments/environment';

// const Video = Twilio.Video;

@Component({
  selector: 'app-twilo-video',
  templateUrl: './twilo-video.component.html',
  styleUrls: ['./twilo-video.component.scss']
})
export class TwiloVideoComponent implements OnInit {

  roles;
  userInfo;
  UrlData;

  private socket;

  NewSessionObj = {
    courseId: "",
    batchId: "",
    topicId: "",
    subtopicId: "",
    users: null,
    admin: "",
    roomName: "",
    roomSId: "",
    sessionToken: "",
  }

  myMedias: any;




  room;
  numVideoTracks = 0;

  window: any;

  constructor(
    private CommonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private EncrDecrService: EncrDecrService,
    private toastr: ToastrService,
  ) {

    this.userInfo = this.CommonService.getuserInfo();
    this.roles = this.CommonService.getRoles()
    // console.log("userInfo", this.userInfo);
    this.route.queryParams.subscribe(params => {
      if (params.Data) {
        var DecriptedData = this.EncrDecrService.get(params.Data);
        this.UrlData = JSON.parse(DecriptedData);

        this.NewSessionObj = {
          courseId: this.UrlData.courseId,
          batchId: this.UrlData.batchId,
          topicId: this.UrlData.topicId,
          subtopicId: this.UrlData.subtopicId,
          users: this.UrlData.users,
          admin: this.UrlData.admin,
          roomName: this.UrlData.roomName,
          roomSId: this.UrlData.roomSId,
          sessionToken: this.UrlData.sessionToken,
        }
        console.log('this.newsessionobj')
        console.log(this.NewSessionObj)
      }

    })

  }

  ngOnInit(): void {
    console.log('video session initiated')
    this.socket = socketIo(environment.SERVER_URL);
    this.socket.emit('NewClient', this.connectLocalVideo());
  }


  connectLocalVideo() {
    let that = this;
    Video.connect(this.NewSessionObj.sessionToken, {
      name: this.NewSessionObj.roomName,
      video: true,
      audio: false
    }).then(room => {

      // window.room = room;

      console.log(room)
      console.log('Connected to Room "%s"', room.name);



      room.localParticipant.tracks.forEach(function (track) {
        if (track.kind == "audio") return; //Typically, I don't want to listen my own audio
        var mediaElement = track.track.attach();
        document.getElementById('divLocalVideoContainer').appendChild(mediaElement);
      });



      //Display currently connected participants' tracks, if any

      // console.log("Managing pre-existing participants");

      // room.participants.forEach(function (participant) {
      //   console.log(participant)
      //   if (participant) {
      //     participant.tracks.forEach(this.attachTrack);
      //     this.manageConnectedParticipant(participant);
      //   }
      //   console.log(".............", participant);
      // });

      // // room.on('participantConnected', this.manageConnectedParticipant(room.participants));
      // room.on('participantConnected', participant => {
      //   console.log(`A remote Participant connected: ${participant}`);
      //   this.manageConnectedParticipant(participant)
      // });

      room.participants.forEach(function (participant) {
        that.participantConnected(participant)
      });
      room.on('participantConnected', participant => {
        console.log(`A remote Participant connected: ${participant}`);
        that.participantConnected(participant)
      });
      room.on('participantDisconnected', participant => {
        that.participantDisconnected(participant)
      });
      room.on('disconnected', error => {
        room.participants.forEach(function (participant) {
          that.participantDisconnected(participant)
        });
      });


      // room.participants.forEach(this.participantConnected);
      // room.on('participantConnected', this.participantConnected);
      // room.on('participantDisconnected', this.participantDisconnected);
      // room.once('disconnected', error => room.participants.forEach(this.participantDisconnected));
    });
  }

  participantConnected(participant) {
    console.log('Participant "%s" connected', participant.identity);

    let that = this;
    const div = document.createElement('div');
    div.id = participant.sid;
    div.innerText = participant.identity;

    participant.on('trackSubscribed', track => that.trackSubscribed(div, track));
    // participant.on('trackUnsubscribed', this.trackUnsubscribed);
    participant.on('trackUnsubscribed', track => {
      that.trackUnsubscribed(track)
    });

    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        that.trackSubscribed(div, publication.track);
      }
    });

    document.body.appendChild(div);
  }

  participantDisconnected(participant) {
    console.log('Participant "%s" disconnected', participant.identity);
    document.getElementById(participant.sid).remove();
  }

  trackSubscribed(div, track) {
    div.appendChild(track.attach());
  }

  trackUnsubscribed(track) {
    track.detach().forEach(element => element.remove());
  }


  manageConnectedParticipant(participant) {
    console.log("other participant", participant);
    console.log("Participant " + participant.identity + " connected");

    if (participant.identity !== undefined) {
      var intraval = setInterval(() => {
        if (participant) {
          participant.tracks.forEach(track => {
            if (track.track) {
              this.attachTrack(track.track);
              clearInterval(intraval)
            }
            console.log(".............", track);
          })
        }

      }, 2000)

      // participant.on('trackAdded', attachTrack);
      // participant.on('trackRemoved', detachTrack);
      this.updateNumParticipants();
    }

  }


  attachTrack(track) {
    var mediaElement = track.attach();
    document.getElementById('divRemoteVideoContainer').appendChild(mediaElement);
    if (track.kind == 'video') this.updateDisplay(1);
  }



  updateDisplay(num) {
    this.numVideoTracks += num;
    var videoTagWidth = 100 / (1 + this.numVideoTracks);
    var remoteVideoTags = document.querySelectorAll("#divRemoteVideoContainer video")
    remoteVideoTags.forEach(function (videoTag) {
      // videoTag.style.width = +videoTagWidth + '%';
    });
  }

  updateNumParticipants() {
    var labelNumParticipants = document.getElementById('labelNumParticipants');
    labelNumParticipants.innerHTML = this.room.participants.size + 1;
  }



  CheckMedia() {
    // document.getElementById('myMedia').appendChild(this.myMedias);
    Video.connect(this.NewSessionObj.sessionToken, { 'name': "new name" }).then(room => {
      console.log(`Successfully joined a Room: ${room}`);
      room.on('participantConnected', this.manageConnectedParticipant(room.localParticipant));
    }, error => {
      console.error(`Unable to connect to Room: ${error.message}`);
    });
    // window.room.on('participantConnected', this.manageConnectedParticipant);

  }



  //   function participantConnected(participant) {
  //   console.log('Participant "%s" connected', participant.identity);

  //   const div = document.createElement('div');
  //   div.id = participant.sid;
  //   div.innerText = participant.identity;

  //   participant.on('trackSubscribed', track => trackSubscribed(div, track));
  //   participant.on('trackUnsubscribed', trackUnsubscribed);

  //   participant.tracks.forEach(publication => {
  //     if (publication.isSubscribed) {
  //       trackSubscribed(div, publication.track);
  //     }
  //   });

  //   document.body.appendChild(div);
  // }


  // function participantDisconnected(participant) {
  //   console.log('Participant "%s" disconnected', participant.identity);
  //   document.getElementById(participant.sid).remove();
  // }

  // function trackSubscribed(div, track) {
  //   div.appendChild(track.attach());
  // }

  // function trackUnsubscribed(track) {
  //   track.detach().forEach(element => element.remove());
  // }







}
