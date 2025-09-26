import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@features/user/interfaces/user';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private fcToastService: FcToastService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(1),
      catchError((e) => {
        if (e.status === 400) {
          this.fcToastService.clear();
          let messages = '';
          if (e.error.response instanceof Object) {
            if (e.error.response.message instanceof Array) {
              e.error.response.message.forEach((message: any) => {
                messages += message + '<br/>';
              });
            } else {
              messages = e.error.response.message;
            }
          } else {
            messages = e.error.response;
          }
          this.fcToastService.add({
            severity: 'error',
            header: e.error.message,
            message: messages,
          });
        } else if (e.status === 401) {
          // Clear local storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          // Provide an empty UserData object
          this.authService.currentUserDataSubject.next({} as User);

          this.authService.currentUseraccess_tokensSubject.next('');
          this.router.navigate(['/auth/login']);
          this.fcToastService.add({
            header: 'Login',
            message: 'Email or password is incorrect',
            lottieOption: {
              path: './assets/images/lotties/warning.json',
              loop: false,
            },
          });
        }
        // else if (e.status === 403) {
        //   this.fcToastService.clear();
        //   this.fcToastService.add({
        //     severity: 'error',
        //     header: 'Forbidden',
        //     message:
        //       e.error?.message ||
        //       'You are not allowed to access this resource.',
        //     life: 3000,
        //   });
        //   // this.router.navigate(['/dashboard']);
        // }
        else if (e.status === 404) {
          this.router.navigate(['/error/not-found']);
        }
        const error = e.error;
        return throwError(error);
      })
    );
  }
}
