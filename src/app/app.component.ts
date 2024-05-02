import { Component, inject } from '@angular/core';
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
export class AppComponent {
  myForm!: FormGroup;
  fb = inject(FormBuilder);
  wsUrl = '';
  messages: ChatMessage[] = [
    {
      timestamp: 1,
      message: 'ME',
      from: 'me',
    },
    {
      timestamp: 2,
      message: 'OTHER',
      from: 'other',
    },
  ];
  connected = false;
  connecting = false;

  constructor() {
    this.myForm = this.fb.group({
      message: [null, Validators.required],
    });
  }

  formSubmit() {
    if (this.myForm.valid) {
      console.log(this.myForm.value);
    } else {
      console.log('INVALID');
    }
  }
}
