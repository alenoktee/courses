import { Component, OnInit } from '@angular/core';
import { UserService, User } from './services/user.service';

@Component({
  selector: 'app-root',
  template: `<h1>{{ user?.name }}</h1>`,
})
export class AppComponent implements OnInit {
  user: User | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser(1).subscribe({
      next: user => this.user = user,
      error: err => console.error('Ошибка загрузки:', err)
    });
  }
}
