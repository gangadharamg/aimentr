import { ActivatedRoute, Data } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment'
import * as firebase from 'firebase';
import { CommonService } from 'src/app/Services/common.service';
import { APIURL } from 'src/app/url';


// import { AuthNewService } from 'src/app/modules/auth-new/services/auth-new.service';
// import * as CodeMirror from 'codemirror';
// import from 'src/assets/js/firepad.min.js';
// import * as codemirror from 'src/assets/js/codemirror';

// declare const firebase;
declare const CodeMirror;
declare const Firepad;
declare const FirepadUserList: any;

// firebase.initializeApp(environment.FIREBASE);


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  firepadBaseRef;

  userRole: number;
  sessionId: string;
  currentLanguage: string = 'javascript';
  firepadRef;

  codeMirroConfig: any = {
    lineWrapping: true,
    mode: 'javascript',
    theme: 'blackboard',
    mime: "text/javascript",
    lineNumbers: true,
    styleActiveLine: true,
    extraKeys: { "Ctrl-Space": "autocomplete" }
  }

  firepad: any;
  output: any;
  showAlert: Boolean = false;

  @Output('handleSessionEvent') handleSessionEvent = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private CommonService: CommonService
  ) {
    route.params.subscribe((p) => {
      this.sessionId = p['id'];
    })
  }

  ngOnInit() {
    this.userRole = this.CommonService.getuserInfo().role;

    // Get Firebase Database reference.
    this.firepadBaseRef = firebase.database().ref();
    if (this.firepadBaseRef) {
      this.firepadRef = this.firepadBaseRef.child(this.sessionId + "/javascript");
    }

    // Create a random ID to use as our user ID (we must give this to firepad and FirepadUserList).
    // var userId = Math.floor(Math.random() * 9999999999).toString();
    var userId = this.CommonService.getuserInfo().username;

    // Create CodeMirror (with lineWrapping on).
    var codeMirror = CodeMirror(document.getElementById('firepad'), this.codeMirroConfig);

    // Create Firepad (with rich text toolbar and shortcuts enabled).
    this.firepad = Firepad.fromMonaco(this.firepadRef, codeMirror, {
      defaultText: 'console.log(Welcome to Conmentr!)',
      userId: userId
    });

    //// Create FirepadUserList (with our desired userId).
    var firepadUserList = FirepadUserList.fromDiv(this.firepadRef.child('users'), document.getElementById('userlist'), userId, userId);

    console.log(firepadUserList);

    this.firepad.on('ready', function () {
      // Firepad is ready.
      console.log("Firepad is ready.")
    });

    // this.firepad.on('ready', function() {
    //   if (this.firepad.isHistoryEmpty()) {
    //     this.firepad.setText('Check out the user list to the left!');
    //   }
    // });
  }



  changeLanguage(language) {
    let greet = 'Welcome to aimentr!';
    document.getElementById('firepad').innerHTML = '';
    let config = JSON.parse(JSON.stringify(this.codeMirroConfig));
    config.mode = language;
    var codeMirror = CodeMirror(document.getElementById('firepad'), config);
    this.firepad = Firepad.fromMonaco(this.firepadBaseRef.child(this.sessionId + "/" + language), codeMirror, {
      defaultText: language == 'javascript' ? `console.log('${greet}');` : `print(${greet})`,
      userId: this.CommonService.getuserInfo().username
    });
  }

  runcode() {
    const text = this.firepad.getText();
    let postdata = {
      code: text,
      language: this.currentLanguage == 'javascript' ? 'node' : this.currentLanguage
    }

    var url = APIURL.COMPILE_CODE;
    this.CommonService.postMethod(url, postdata)
      .subscribe((res: Data) => {
        // console.log("Res:: ",res);
        this.output = res.data;
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 2000)
      }, (err) => {
        // console.log("err",err);
      })
  }

  emitSessionEvent(api) {
    this.handleSessionEvent.emit({ api });
  }

}
