import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private registrationData: any = null;

  constructor(private http: HttpClient) {
    
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

private readonly baseUrl:string= 'http://localhost:5198/';

  setRegistrationData(data: any) {
    this.registrationData = data;
  }

  getRegistrationData() {
    return this.registrationData;
  }

  register(email: string, password: string, firstName: string, lastName: string, dateOfBirth?: string, phone?: string): Observable<any> {
    return this.http.post<any>(this.baseUrl+'api/auth/register', { email, password, firstName, lastName, dateOfBirth, phone });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.baseUrl+'api/auth/login', { email, password })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  googleLogin(token: string): Observable<any> {
    return this.http.post<any>(this.baseUrl+'api/auth/google-login', { token })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }
}
