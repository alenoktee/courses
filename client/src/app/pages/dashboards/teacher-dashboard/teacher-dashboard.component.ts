import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { LayoutComponent } from '../../../components/layout/layout.component';
import { AuthService } from '../../../services/auth.service';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';



@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    NzGridModule, 
    NzLayoutModule, 
    NzButtonModule,
    NzTypographyModule,
    NzDividerModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzCardModule,
    LayoutComponent,
    NzPaginationModule
  ],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})
export class TeacherDashboardComponent implements OnInit {
  userName: string = '';
  averageScore: number | null = null;
  groups: string | null = null;
  totalStudents: number | null = null;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.firstName || user.name || 'Преподаватель';
      }
    });
    
    // Здесь будет логика для получения данных с сервера
    // Пока используем тестовые данные
    this.averageScore = 4.7;
    this.groups = 'Группа 1, Группа 2';
    this.totalStudents = 42;
  }
}
