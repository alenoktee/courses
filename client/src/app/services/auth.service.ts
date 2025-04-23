import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email: string;
  googleId: string;
  profilePictureUrl: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  isNewUser?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5198/api/auth';
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private registrationData: any = null;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private isNewUserSubject = new BehaviorSubject<boolean>(false);
  public isNewUser$ = this.isNewUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredAuth();
  }

  setRegistrationData(data: any) {
    this.registrationData = data;
  }

  getRegistrationData() {
    return this.registrationData;
  }

  private loadStoredAuth(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem(this.userKey);
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (e) {
        this.logout();
      }
    }
  }

  public login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap(response => this.handleAuthentication(response))
      );
  }

  public googleLogin(code: string, redirectUri: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/google`, { code, redirectUri })
      .pipe(
        tap(response => {
          this.handleAuthentication(response);
          this.isNewUserSubject.next(response.isNewUser || false);
        })
      );
  }

  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.isNewUserSubject.next(false);
    
    this.router.navigate(['/auth/login']);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  public isNewUser(): boolean {
    return this.isNewUserSubject.getValue();
  }

  register(email: string, password: string, firstName: string, lastName: string, middleName?: string, dateOfBirth?: string, phone?: string, isTeacher?: boolean): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/register`, { 
        email, 
        password, 
        firstName, 
        lastName, 
        middleName, 
        dateOfBirth, 
        phone,
        isTeacher
    });
  }
} 