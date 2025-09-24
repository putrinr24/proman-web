import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Ability, AbilityBuilder, PureAbility } from '@casl/ability';
import { User } from '@features/user/interfaces/user';
import { BehaviorSubject, map } from 'rxjs';
import { decrypt, encrypt } from '@core/encryption/encryption.util';
import { environment } from '@env';
import { PROJECT_MANAGEMENT_ROLES } from '@features/user/user.constants';

const ROOT_API_URL = `${environment.API_URL}`;

const userAbility = [
  {
    name: 'owner',
    enums: [0],
    abilities: [],
  },
  {
    name: 'project_manager',
    enums: [1],
    abilities: [],
  },
  {
    name: 'developer',
    enums: [2],
    abilities: [],
  },
  {
    name: 'customer',
    enums: [3],
    abilities: [],
  },
];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUseraccess_tokensSubject: BehaviorSubject<string>;
  currentUserDataSubject: BehaviorSubject<User>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ability: PureAbility
  ) {
    this.currentUseraccess_tokensSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('token') as string)
    );
    this.currentUserDataSubject = new BehaviorSubject<User>(
      this.getStoredUserData() || ({} as User)
    );
    this.updateAbility(this.currentUserDataSubject.value);
  }

  private getStoredUserData(): User | null {
    const encryptedData = localStorage.getItem('user');
    if (encryptedData) {
      try {
        const decryptedData = decrypt(encryptedData);
        return JSON.parse(decryptedData) as User;
      } catch (e) {
        console.error('Failed to decrypt user data', e);
        return null;
      }
    }
    return null;
  }

  public get getCurrentUseraccess_tokens(): string {
    return this.currentUseraccess_tokensSubject.value;
  }

  public get getCurrentUserData(): BehaviorSubject<User> {
    return this.currentUserDataSubject;
  }

  private updateAbility(user: User) {
    const { can, rules } = new AbilityBuilder(Ability);
    const ability = userAbility.find((ability) =>
      ability.enums.includes(user.role)
    );
    ability?.abilities.forEach((rule) => {
      can(rule[1], rule[0]);
    });

    this.ability.update(rules);
  }

  login(loginData: any) {
    return this.http.post(ROOT_API_URL + '/auth/login', loginData).pipe(
      map((res: any) => {
        if (res.statusCode === 200) {
          localStorage.setItem('token', JSON.stringify(res.data.access_token));
          this.currentUseraccess_tokensSubject.next(res.data.access_token);
          localStorage.setItem('user', encrypt(JSON.stringify(res.data.user)));
          this.currentUserDataSubject.next(res.data.user);
          this.updateAbility(res.data.user);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  isLoggedIn(): boolean {
    if (this.currentUseraccess_tokensSubject.value) {
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUseraccess_tokensSubject.next('');
    this.currentUserDataSubject.next({} as User);
    this.router.navigate(['/auth/login']);
  }

  updateUserData(user: User) {
    this.currentUserDataSubject.next(user);
    localStorage.setItem('user', encrypt(JSON.stringify(user)));
  }

  register(registerData: any) {
    return this.http.post(ROOT_API_URL + '/auth/register', registerData);
  }

  get isManager() {
    return PROJECT_MANAGEMENT_ROLES.includes(
      this.getCurrentUserData.value.role
    );
  }
}
