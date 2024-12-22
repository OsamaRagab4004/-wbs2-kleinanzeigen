import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { format } from 'date-fns';
import { MessageSocket } from '../../app.module';

@Component({
  selector: 'app-mini-chat',
  templateUrl: './mini-chat.component.html',
  styleUrls: ['./mini-chat.component.sass'],
})
export class MiniChatComponent implements OnDestroy, OnInit, AfterViewChecked, OnChanges {
  @Input() produktId: number = 0;
  @Input() verkaeuferName: string = '';
  @ViewChild('chat')
  private chat!: ElementRef;

  public text: string = '';
  public messages: any[] = [];
  public chatId: number = 0;

  constructor(private socket: MessageSocket) {}

  ngOnInit(): void {
    this.socket.disconnect();
    if (!this.socket.ioSocket.connected) {
      this.socket.connect();
    }
    this.loadChat();
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.socket.disconnect();
    if (!this.socket.ioSocket.connected) {
      this.socket.connect();
    }
    this.loadChat();
  }

  loadChat() {
    this.socket.on('connect', (response: any) => {
      this.socket.emit(
        'loadChat',
        { produktId: this.produktId },
        (res: any) => {
          const json = JSON.parse(res);
          this.messages = json.messages;
          this.chatId = json.chatId;
        }
      );
    });
    this.socket.on('error', (error: any) => {
      console.error(error);
    });
    this.socket.on('nachricht', (response: any) => {
      this.messages.push(response);
    });
  }

  send() {
    if (this.text.length) {
      this.socket.emit('nachricht', {
        chatId: this.chatId,
        nachricht: this.text,
      });
      this.text = '';
    }
  }

  scrollToBottom() {
    try {
      this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
    } catch (e) {
      console.error(e);
    }
  }

  getFormattedDate(date: string) {
    return format(new Date(date), 'dd.MM.yyy HH:mm');
  }

  keydown(event: any) {
    console.log(event);
  }
}
