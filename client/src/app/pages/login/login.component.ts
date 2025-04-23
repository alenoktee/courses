import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          // Перенаправление в зависимости от роли пользователя
          if (response.user.role === 'преподаватель') {
            this.router.navigate(['/pages/dashboards/teacher-dashboard']);
          } else {
            this.router.navigate(['/pages/dashboards/student-dashboard']);
          }
        },
        error: (error) => {
          console.error('Ошибка при входе:', error);
          this.errorMessage = error.error?.message || 'Неверный email или пароль';
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  googleLogin() {
    const clientId = '196351865869-kq6bbtfs5f9agrfk192kiff6kgnnvunb.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('http://localhost:4200/auth-callback');
    const scope = encodeURIComponent('email profile');
    const responseType = 'code';
    const accessType = 'offline';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&access_type=${accessType}`;
    
    window.location.href = authUrl;
  }
}