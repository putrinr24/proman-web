import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  currentUseraccess_tokens: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.currentUseraccess_tokens =
      this.authService.getCurrentUseraccess_tokens;
    if (this.currentUseraccess_tokens) {
      return true;
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
}
