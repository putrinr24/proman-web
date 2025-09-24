import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JWTInterceptor } from './interceptors/jwt.interceptor';

export abstract class EnsureImportedOnceModule {
  protected constructor(targetModule: any) {
    if (targetModule) {
      throw new Error(
        `${targetModule.constructor.name} has already been loaded.`
      );
    }
  }
}

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // {
    //       provide: Sentry.TraceService,
    //       deps: [Router],
    // },
    // {
    //       provide: APP_INITIALIZER,
    //       useFactory: () => () => {},
    //       deps: [Sentry.TraceService],
    //       multi: true,
    // },
  ],
})
export class CoreModule extends EnsureImportedOnceModule {
  public constructor(@SkipSelf() @Optional() parent: CoreModule) {
    super(parent);
  }
}
