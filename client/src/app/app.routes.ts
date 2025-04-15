import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RegisterStep2Component } from './auth/register/register-step2/register-step2.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/register/step2', component: RegisterStep2Component },
  { path: 'auth-callback', component: AuthCallbackComponent }
];
