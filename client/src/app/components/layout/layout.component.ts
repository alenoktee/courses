import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzGridModule,
    NzMenuModule,
    NzIconModule,
    NzBreadCrumbModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  @Input() pageTitle: string = 'Личный кабинет';
  @Input() showBreadcrumb: boolean = true;
  @Input() userRole: string = '';
  
  constructor(private authService: AuthService) {}
  
  logout() {
    this.authService.logout();
  }
}
