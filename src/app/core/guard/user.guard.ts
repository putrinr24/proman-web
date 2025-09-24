import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { PROJECT_MANAGEMENT_ROLES } from '@features/user/user.constants';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class UserGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const userId = Number(route.paramMap.get('userId'));

    const user = this.authService.getCurrentUserData.value;

    if (!PROJECT_MANAGEMENT_ROLES.includes(user.role) && +userId !== +user.id) {
  this.router.navigate(['/']);
  return false;
}


    return true;
  }
}
