import { Component, Input, ElementRef, AfterViewInit, ViewChild, OnInit, HostListener } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import { ChatService } from 'src/app/Services/chat.service';
import { ActivatedRoute, Data } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';

import { environment } from 'src/environments/environment';
import * as socketIo from 'socket.io-client';
import { APIURL } from 'src/app/url';

@Component({
  selector: 'app-drawingpad',
  templateUrl: './drawingpad.component.html',
  styleUrls: ['./drawingpad.component.scss']
})
export class DrawingpadComponent implements OnInit {

  UserInfo;
  sessionId: string;
  private socket;
  role = '';
  @ViewChild('canvas', { static: true }) public canvas: ElementRef;

  @Input() public width = 1500;
  @Input() public height = 800;


  private cx: CanvasRenderingContext2D;

  @HostListener('window:resize', ['$event.target'])
  onResize() {
    // console.log(this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // this.canvasEl.width = this.canvas.nativeElement.width;
    // this.canvasEl.height = this.canvas.nativeElement.height;
  }


  constructor(
    private socketService: ChatService,
    private CommonService: CommonService,
    private route: ActivatedRoute
  ) {
    this.UserInfo = this.CommonService.getuserInfo();
    route.params.subscribe((p) => {
      this.sessionId = p['id'];
    })
  }

  ngOnInit(): void {

    this.socket = socketIo(environment.SERVER_URL);

    // this.socketService.on()
    //   .subscribe((cx: any) => {
    //     if (cx.session == this.sessionId) {
    //       this.cx = cx;
    //     }
    //     console.log('cx:: ', cx);
    //   });

    this.socket.on('Drawing', (data) => {
      console.log('cx:: ', data);
      // this.translateText('', data.text);
      
    })

    this.initVideoSession();
  }

  initVideoSession() {
    let username = this.UserInfo.username;
    let postdata = { username, sessionId: this.sessionId };

    var url = APIURL.IS_ADMIN_FOR_SESSION;
    this.CommonService.postMethod(url, postdata)
      .subscribe((res: Data) => {
        this.role = 'admin';
        console.log("role", res);
        
      }, err => {
        this.role = 'student';
        console.log("err:: ", err);
      })
  }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;



    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event    
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise()
            )
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();


      // this.socketService.Drawing(this.cx);
      console.log('JSON.stringify(this.cx)' , document.getElementById('canvasMovement'))
      this.socket.emit('Drawing', document.getElementById('canvasMovement'));

    }
  }








  // constructor() {

  // }

  // ngOnInit(): void {
  // }


  // canvasOptions: CanvasWhiteboardOptions = {
  //   drawButtonEnabled: true,
  //   drawButtonClass: "drawButtonClass",
  //   drawButtonText: "Draw",
  //   clearButtonEnabled: true,
  //   clearButtonClass: "clearButtonClass",
  //   clearButtonText: "Clear",
  //   undoButtonText: "Undo",
  //   undoButtonEnabled: true,
  //   redoButtonText: "Redo",
  //   redoButtonEnabled: true,
  //   colorPickerEnabled: true,
  //   saveDataButtonEnabled: true,
  //   saveDataButtonText: "Save",
  //   lineWidth: 5,
  //   strokeColor: "rgb(0,0,0)",
  //   shouldDownloadDrawing: true
  // };
  // @Output() onClear = new EventEmitter<any>();
  // @Output() onBatchUpdate = new EventEmitter<CanvasWhiteboardUpdate[]>();
  // @Output() onImageLoaded = new EventEmitter<any>();
  // @Output() onUndo = new EventEmitter<any>();
  // @Output() onRedo = new EventEmitter<any>();
  // @Output() onSave = new EventEmitter<string | Blob>();


}
