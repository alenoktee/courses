import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterStep2Component } from './pages/register/register-step2/register-step2.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { TeacherDashboardComponent } from './pages/dashboards/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './pages/dashboards/student-dashboard/student-dashboard.component';
import { AdminDashboardComponent } from './pages/dashboards/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/register/step2', component: RegisterStep2Component },
  { path: 'auth-callback', component: AuthCallbackComponent },
  { path: 'pages/dashboards/teacher-dashboard', component: TeacherDashboardComponent },
  { path: 'pages/dashboards/student-dashboard', component: StudentDashboardComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent }
];
