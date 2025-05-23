import { Component, OnInit } from '@angular/core';
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
  styleUrl: './register-step2.component.scss'
})
export class RegisterStep2Component implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
  minDate: string;
  maxDate: string;
  isGoogleAuth: boolean = false;

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

  ngOnInit() {
    // Получаем данные из первого шага регистрации
    const registrationData = this.authService.getRegistrationData();
    
    if (registrationData) {
      // Определяем, была ли авторизация через Google (если пароль пустой)
      this.isGoogleAuth = !registrationData.password;
      
      // Заполняем форму данными
      if (registrationData.firstName) {
        this.registerForm.patchValue({
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          middleName: registrationData.middleName || '',
          phone: registrationData.phoneNumber || '',
          dateOfBirth: registrationData.dateOfBirth || '',
          isTeacher: registrationData.isTeacher || false
        });
      }
    } else {
      // Если нет данных регистрации, перенаправляем на первый шаг
      this.router.navigate(['/auth/register']);
    }
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
        middleName: ['', [ // Добавляем отчество
            Validators.minLength(2),
            Validators.maxLength(50),
            Validators.pattern('^[а-яА-ЯёЁa-zA-Z\\s-]+$')
        ]],
        dateOfBirth: ['', [
            Validators.required,
            this.validateDateOfBirth
        ]],
        phone: ['', [ // Переименовано с phoneNumber на phone
            Validators.required,
            Validators.pattern('^\\+375(29|25|44|33)\\d{7}$')
        ]],
        isTeacher: [false]
    });
  }

  // ЗАПОЛНЕНИЕ СЛУЧ. ДАННЫМИ
  fillFormWithRandomData() {
    const randomFirstName = `Имя`;
    const randomLastName = `Фамилия`;
    const randomMiddleName = `Отчество`;
    const randomPhone = `+37529${Math.floor(1000000 + Math.random() * 9000000)}`;
    const randomDateOfBirth = new Date(1990 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0];

    this.registerForm.setValue({
        firstName: randomFirstName,
        lastName: randomLastName,
        middleName: randomMiddleName,
        dateOfBirth: randomDateOfBirth,
        phone: randomPhone,
        isTeacher: Math.random() < 0.5
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
  get phone() { return this.registerForm.get('phone')!; }
  get middleName() { return this.registerForm.get('middleName')!; }

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
        registrationData.middleName,
        registrationData.dateOfBirth,
        registrationData.phone,
        registrationData.isTeacher
      ).subscribe({
        next: (response) => {
          if (registrationData.isTeacher) {
            this.router.navigate(['/pages/dashboards/teacher-dashboard']);
          } else {
            this.router.navigate(['/pages/dashboards/student-dashboard']);
          }
        },
        error: (error) => {
          console.error('Ошибка при регистрации:', error);
          this.errorMessage = error.error?.message || 'Произошла ошибка при регистрации';
        }
      });
    }
  }
}