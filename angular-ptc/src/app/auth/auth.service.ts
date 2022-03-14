import { Injectable } from '@angular/core';
import {User} from '../models/user.model';
import { throwError, BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import {ErrorHandlingService} from '../shared/error-handling.service';

@Injectable()
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private router: Router,
              private http: HttpClient,
              private errorHandler: ErrorHandlingService) {
  }

  login(username: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json'
      })};


    return this.http
      .post<any>(
        'http://localhost:8081/token',
        {
          username: username,
          password: password
        },
        httpOptions
      ).pipe(
        catchError(this.handleError),
        tap(responseData => {
          let jwtData = responseData.access_token.split('.')[1];
          let decodedJwtJsonData = window.atob(jwtData);
          let decodedJwtData = JSON.parse(decodedJwtJsonData);
          this.handleAuthentication(
                  decodedJwtData.preferred_username,
                  decodedJwtData.email,
                  responseData.access_token,
                  decodedJwtData.resource_access.public_transport_backend.roles,
                  responseData.expires_in
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    username: string,
    email: string,
    accessToken: string,
    role: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(username, email, accessToken, role, expirationDate);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
    const expirationDuration =
      new Date(expirationDate).getTime() -
      new Date().getTime();
    this.autoLogout(expirationDuration);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    console.log('Error: ' + errorRes);
    return throwError(errorMessage);
  }
}
