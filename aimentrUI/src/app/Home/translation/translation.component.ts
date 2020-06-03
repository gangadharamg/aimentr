import { Component, OnInit } from '@angular/core';
import {APIURL} from '../../url'
import { CommonService } from '../../Services/common.service';
import { Router, NavigationExtras, ActivatedRoute, Data } from '@angular/router';


@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss']
})
export class TranslationComponent implements OnInit {

  constructor(private CommonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
  }



  filesToUpload: Array<File> = [];

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.uploadBulkOfData();
  }
  uploadBulkOfData() {
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    formData.append("uploads[]", files[0], files[0]['name']);

    var url = APIURL.GET_AUDIO_TO_TEXT;
    this.CommonService.postMethod(url, formData)
      .subscribe((data: Data) => {
        if (data.Status == 200) {
          console.log("Data===>",data);
        }
        else {
          console.log("err===>",data);
        }
      })
  }
}
