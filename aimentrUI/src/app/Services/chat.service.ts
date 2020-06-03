import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Message } from './models/message';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatEvents } from './models/chat-events';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket;
  constructor() {
    this.initSocket();
  }

  public initSocket(): void {

    this.socket = socketIo(environment.SERVER_URL);
  }

  public disconnectSocket() {
    this.socket.emit('disconnect');
  }

  public send(message: Message): void {
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<any> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => 
      observer.next(data));
    });
  }

  public onEvent(event: ChatEvents): Observable<any> {
    return new Observable<ChatEvents>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }


  public Drawing(cx: any): void {
    this.socket.emit('Drawing', cx);
  }
  public onDrawing(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('Drawing', (data: any) => observer.next(data));
    });
  }


}
