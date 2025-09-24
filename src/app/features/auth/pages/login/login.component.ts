import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { delay } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'fc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, FontAwesomeModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;
  isPasswordVisible = false;
  faSpinner = faSpinner;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}
  get loginFormControl() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  resetUsername() {
    this.loginForm.get('username')?.patchValue('');
  }

  submit() {
    this.loading = true;
    this.authService
      .login(this.loginForm.value)
      .pipe(delay(200))
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res) {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          this.loading = false;
        },
      });
  }
}
