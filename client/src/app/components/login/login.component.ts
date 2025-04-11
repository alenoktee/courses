import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <h2>Вход в систему</h2>
      <button (click)="loginWithGoogle()" class="google-btn">
        <img src="assets/google-icon.svg" alt="Google" width="20" height="20">
        Войти через Google
      </button>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    
    h2 {
      margin-bottom: 20px;
      color: #333;
    }
    
    .google-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 10px 20px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s;
    }
    
    .google-btn:hover {
      background-color: #f1f1f1;
    }
  `]
})
export class LoginComponent {
  
  loginWithGoogle() {
    const clientId = '196351865869-kq6bbtfs5f9agrfk192kiff6kgnnvunb.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('http://localhost:4200/auth-callback');
    const scope = encodeURIComponent('email profile');
    const responseType = 'code';
    const accessType = 'offline';
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&access_type=${accessType}`;
    
    window.location.href = authUrl;
  }
} 