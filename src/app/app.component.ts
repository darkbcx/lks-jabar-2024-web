import { Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WebsocketService } from './services/websocket.service';
import { Subscription } from 'rxjs';

type ChatMessage = {
  timestamp: number;
  message: string;
  from: 'me' | 'other';
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  websocketService = inject(WebsocketService);
  myForm!: FormGroup;
  fb = inject(FormBuilder);
  wsUrl = '';
  messageFromServer = '';
  wsSubscription: Subscription | undefined;
  status = '';
  messages: ChatMessage[] = [];
  connected = false;

  constructor() {
    this.myForm = this.fb.group({
      message: [null, Validators.required],
    });
  }

  ngOnDestroy(): void {
    if (this.wsSubscription && !this.wsSubscription.closed)
      this.wsSubscription.unsubscribe();
  }

  formSubmit() {
    if (this.myForm.valid) {
      console.log(this.myForm.value);
      this.websocketService.sendMessage(this.myForm.value.message);
      this.messages.push({
        timestamp: new Date().getTime(),
        message: this.myForm.value.message + '',
        from: 'me',
      });
      this.myForm.patchValue({ message: '' });
    } else {
      console.log('INVALID');
    }
  }

  connect() {
    if (this.wsUrl) {
      this.connected = true;
      this.wsSubscription = this.websocketService
        .createObservableSocket(this.wsUrl)
        .subscribe({
          next: (data) => this.wsDataHandler(data),
          error: (err) => this.wsErrorHandler(err),
          complete: () => this.wsCompleteHandler(),
        });
    }
  }

  disconnnect() {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
      this.connected = false;
      this.wsUrl = '';
      this.messages = [];
    }
  }

  private wsDataHandler(data: any) {
    this.messages.push({
      timestamp: new Date().getTime(),
      message: data,
      from: 'other',
    });
  }

  private wsErrorHandler(error: any) {
    console.log('WS ERROR : ', error);
  }

  private wsCompleteHandler() {
    console.log('WS COMPLETE');
  }
}
