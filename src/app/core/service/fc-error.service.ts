import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';
// import * as Sentry from "@sentry/browser";
// import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class fcErrorService implements ErrorHandler {
  constructor(@Inject(Injector) private injector: Injector) {}

  // Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
  // private get toastrService(): ToastrService {
  //   return this.injector.get(ToastrService);
  // }

  handleError(error: any) {
    // Sentry.captureException(error.originalError || error);
    this.showErrorToastr(error);
  }

  showErrorToastr(message: any) {
    // // console.log(message)
  }
}
