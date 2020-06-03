import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonService } from 'src/app/Services/common.service';
import { APIURL } from 'src/app/url'
import { Data } from '@angular/router';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss']
})
export class TranslationComponent implements OnInit {

  languages: any[];
  selectedLanguage: string = 'en';
  sourceLanguage: string = 'te';
  recognition;
  subtitles: string = 'jalskfjajkflalf';
  speechRecongitionStatus = false;

  sourceLang: string = 'te';
  targetLang: string = 'en';
  translatedText: string[] = [];

  constructor(
    private CommonService: CommonService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getLanguages();
    this.initSpeechEngine();
  }

  getLanguages() {
    if (this.recognition) {
      this.recognition.lang = this.sourceLang;
      this.mute();
      setTimeout(() => this.talk(), 300);
      this.translatedText = [];
    }
    if (this.sourceLang == 'te') {
      this.languages = [
        { name: 'Telugu', language: 'te' },
        { name: "English", language: 'en' },
        { name: 'Hindi', language: 'hi' }
      ];
    } else {

      var url = APIURL.GET_ALL_SUPPORTED_LANGUAGES_FOR_LANG
      this.CommonService.postMethod(url, { langId: this.sourceLang })
        .subscribe(
          (res: Data) => this.languages = res.data,
          err => this.languages = []
        );
    }
  }

  initSpeechEngine() {
    if (window && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 2;
      this.recognition.continuous = true;
      this.recognition.lang = this.sourceLang;

      this.recognition.onstart = () => {
        this.speechRecongitionStatus = true;
      }
      this.recognition.onend = () => {
        this.speechRecongitionStatus = false;
      }
      let finalTranscript = '';
      this.recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;

        let interimTranscript = ''; ``
        for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
          let transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript = transcript;
            this.translateText(finalTranscript, interimTranscript);
          } else {
            interimTranscript += transcript;
          }
        }
      }
    } else {
      console.log("SpeechRecoginition Not supported");
    }
  }

  translateText(finalTranscript, interimTranscript) {
    if (this.targetLang == this.sourceLang) {
      this.translatedText = interimTranscript;
    } else {
      let postdata = {
        text: finalTranscript,
        targetLang: this.targetLang,
        sourceLang: this.sourceLang
      }

      var url = APIURL.TRANSLATE_TEXT;
      this.CommonService.postMethod(url, postdata).subscribe((res: Data) => {
        this.translatedText.push(res.data.translatedText);
        this.cdr.detectChanges();
      }, err => console.log(err));
    }
  }

  talk() {
    this.recognition.start();
    this.speechRecongitionStatus = true;
  }

  mute() {
    this.recognition.stop();
    this.speechRecongitionStatus = false;
  }







  filesToUpload: Array<File> = [];
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.uploadBulkOfData()
  }
  uploadBulkOfData() {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    formData.append("uploads[]", files[0], files[0]['name']);
    var url = APIURL.GET_AUDIO_TO_TEXT;
    this.CommonService.postMethod(url, formData)
      .subscribe(res => {
        console.log("====>", res)
      },
        err => console.log(err));

  }



}
