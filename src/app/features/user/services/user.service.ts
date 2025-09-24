import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { AuthService } from '@features/auth/services/auth.service';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { BehaviorSubject } from 'rxjs';

const ROOT_API = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authService.getCurrentUserData.subscribe((user) => {
      if (user) {
        this.currentUser.next(user);
      }
    });
  }

  getUsers(dataListParameter: DataListParameter = {} as DataListParameter) {
    let param = '';
    if (dataListParameter.rows && dataListParameter.page) {
      param = param.concat(
        `?with_filter=1&page=${dataListParameter.page}&limit=${dataListParameter.rows}`
      );
    }
    if (dataListParameter.sortBy) {
      param = param.concat('&' + dataListParameter.sortBy);
    }
    if (dataListParameter.filterObj) {
      param = param.concat('&' + dataListParameter.filterObj);
    }

    if (dataListParameter.searchQuery) {
      if (!dataListParameter.sortBy) {
        param = param.concat('?q=' + dataListParameter.searchQuery);
      } else {
        param = param.concat('&q=' + dataListParameter.searchQuery);
      }
    }
    if (dataListParameter.queryString) {
      param += dataListParameter.queryString;
    }
    // if (this.currentUser.value.role === 0) {
    //   param = param.concat('&id=' + this.currentUser.value.id);
    // }
    return this.http.get(`${ROOT_API}/admin/users${param}`);
  }

  getUsersByParamString(param: string) {
    return this.http.get(`${ROOT_API}/users?${param}`);
  }

  getUser(id: string) {
    return this.http.get(`${ROOT_API}/users/${id}`);
  }

  getUserSummary(param?: string) {
    return this.http.get(`${ROOT_API}/users/summary/aggregate?${param}`);
  }

  getUserSummaries(param?: string) {
    return this.http.get(`${ROOT_API}/users/summary/all?${param}`);
  }

  addUser(user: any) {
    return this.http.post(`${ROOT_API}/auth/register`, user);
  }

  updateUser(id: string, user: any) {
    return this.http.put(`${ROOT_API}/admin/users/${id}`, user);
  }

  deleteUser(id: string) {
    return this.http.delete(`${ROOT_API}/admin/users/${id}`);
  }

  getUserRoles() {
    return this.http.get(`${ROOT_API}/admin/users/enums/user-roles`);
  }
}
