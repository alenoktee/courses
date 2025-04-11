import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="spinner"></div>
      <p>Авторизация...</p>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top: 4px solid #3498db;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      
      if (code) {
        const redirectUri = 'http://localhost:4200/auth-callback';
        
        console.log('Отправка кода авторизации на сервер:', code);
        console.log('URL API:', this.authService['API_URL']);
        
        this.authService.googleLogin(code, redirectUri)
          .subscribe({
            next: (response) => {
              console.log('Успешная авторизация', response);
              this.router.navigate(['/']);
            },
            error: (error) => {
              console.error('Ошибка авторизации', error);
              
              if (error.status === 0) {
                console.error('Сервер недоступен. Проверьте, запущен ли серверный API');
              } else if (error.status === 404) {
                console.error('API endpoint не найден. Проверьте правильность URL');
              }
              
              this.router.navigate(['/login']);
            }
          });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
} 