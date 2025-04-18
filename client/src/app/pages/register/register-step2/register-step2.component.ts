import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register-step2',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register-step2.component.html',
  styleUrls: ['./register-step2.component.scss']
})
export class RegisterStep2Component {
  registerForm!: FormGroup;
  errorMessage: string = '';
  minDate: string;
  maxDate: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 100);
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 14);

    this.minDate = minDate.toISOString().split('T')[0];
    this.maxDate = maxDate.toISOString().split('T')[0];

    this.initializeForm();
  }

  private initializeForm() {
    this.registerForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('^[а-яА-ЯёЁa-zA-Z\\s-]+$')
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('^[а-яА-ЯёЁa-zA-Z\\s-]+$')
      ]],
      dateOfBirth: ['', [
        Validators.required,
        this.validateDateOfBirth
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^\\+375(29|25|44|33)\\d{7}$')
      ]]
    });
  }

  validateDateOfBirth(control: any) {
    const date = new Date(control.value);
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 100);
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 14);

    if (date < minDate || date > maxDate) {
      return { invalidDate: true };
    }
    return null;
  }

  get firstName() { return this.registerForm.get('firstName')!; }
  get lastName() { return this.registerForm.get('lastName')!; }
  get dateOfBirth() { return this.registerForm.get('dateOfBirth')!; }
  get phoneNumber() { return this.registerForm.get('phoneNumber')!; }

  onSubmit() {
    if (this.registerForm.valid) {
      const registrationData = {
        ...this.authService.getRegistrationData(),
        ...this.registerForm.value
      };

      console.log('Registration data:', registrationData); 

      this.authService.register(
        registrationData.email,
        registrationData.password,
        registrationData.firstName,
        registrationData.lastName,
        registrationData.dateOfBirth,
        registrationData.phoneNumber
      ).subscribe({
        next: (response) => {
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Произошла ошибка при регистрации';
        }
      });
    }
  }
} 