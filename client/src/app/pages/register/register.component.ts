import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?])[A-Za-z\\d!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]+$')
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  onSubmit() {
    if (this.registerForm.valid) {
        const registrationData = {
            ...this.authService.getRegistrationData(),
            ...this.registerForm.value
        };

        console.log('Registration data:', registrationData); 

        this.authService.setRegistrationData(registrationData);
        this.router.navigate(['auth/register/step2']);
    }
}

// ЗАПОЛНЕНИЕ СЛУЧ. ДАННЫМИ
fillFormWithRandomData() {
  const randomEmail = `user${Math.floor(Math.random() * 1000)}@gmail.com`;
  const randomPassword = `PaSSword${Math.floor(Math.random() * 1000)}!@#`;

  this.registerForm.setValue({
      email: randomEmail,
      password: randomPassword,
      confirmPassword: randomPassword
  });
}

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
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
