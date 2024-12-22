import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { format } from 'date-fns';
import { MessageSocket } from 'src/app/app.module';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass'],
})
export class ChatComponent implements OnChanges, AfterViewChecked {
  @Input() chatId: number = 0;
  @Input() role?: 'VERKAEUFER' | 'KAEUFER';
  @ViewChild('chat')
  private chat!: ElementRef;
  public messages: any[] = [];
  public text = '';

  constructor(private socket: MessageSocket) {}

  public isVerkaeufer() {
    if (!this.role) {
      return false;
    }
    return this.role === 'VERKAEUFER';
  }

  public isKaeufer() {
    if (!this.role) {
      return false;
    }
    return this.role === 'KAEUFER';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chatId'] && changes['chatId'].currentValue === 0) {
      return;
    }
    this.messages = [];
    this.socket.disconnect();
    this.cleanupListener()
    this.initializeChat();
    this.scrollToBottom();
  }
  cleanupListener() {
    this.socket.removeAllListeners('nachricht');
    this.socket.removeAllListeners('connect');
    this.socket.removeAllListeners('error');
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  initializeChat() {
    if (!this.socket.ioSocket.connected) {
      this.socket.connect();
    }
    this.socket.on('connect', (response: any) => {
      this.socket.emit('loadChat', { chatId: this.chatId }, (res: any) => {
        const json = JSON.parse(res);
        this.messages = json.messages;
        this.chatId = json.chatId;
        this.scrollToBottom();
      });
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
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    if (this.chatId !== 0) {
      try {
        this.chat.nativeElement.scrollTop =
          this.chat.nativeElement.scrollHeight;
      } catch (e) {}
    }
  }

  getFormattedDate(date: string) {
    return format(new Date(date), 'dd.MM.yyy HH:mm');
  }
}
