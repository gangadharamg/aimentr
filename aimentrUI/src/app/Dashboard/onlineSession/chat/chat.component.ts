import { ChatActions } from 'src/app/services/models/chat-actions';
import { Component, OnInit } from '@angular/core';
import { ChatEvents } from 'src/app/services/models/chat-events';
import { ChatService } from 'src/app/services/chat.service';

import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/services/models/message';

import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  UserInfo;
  action = ChatActions;
  messages: Message[] = [];
  ioConnection: any;
  messageContent: string;
  user: any;

  sessionId: string;

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

  ngOnInit() {
    this.initUser();
    // this.initChat();
  }

  ngOnDestroy(): void {
    this.sendNotification({}, ChatActions.LEFT);
    this.socketService.disconnectSocket();
  }

  initUser() {
    this.user = {
      id: this.UserInfo._id,
      name: this.UserInfo.username,
      avatar: './assets/images/icons/user.png'
    }
    this.initChat();
    this.sendNotification({}, ChatActions.JOINED)
    console.log("User:: ",this.user);
  }

  initChat() {
    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        if (message.session == this.sessionId) {
          this.messages.push(message);
        }
        console.log('message:: ',message);
      });


    this.socketService.onEvent(ChatEvents.CONNECT)
      .subscribe(() => {
        console.log('Client connected');
      });

    this.socketService.onEvent(ChatEvents.DISCONNECT)
      .subscribe(() => {
        console.log('Client disconnected');
      });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }
    this.socketService.send({
      from: this.user,
      session: this.sessionId,
      content: message
    });
    this.messageContent = null;
  }

  public sendNotification(params: any, action: ChatActions): void {
    let message: Message;
    if (action === ChatActions.JOINED || action === ChatActions.LEFT) {
      message = {
        session: this.sessionId,
        from: this.user,
        action: action
      }
    }
    this.socketService.send(message);
  }
}
