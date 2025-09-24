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
export class ProjectService {
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

  getProjects(dataListParameter: DataListParameter = {} as DataListParameter) {
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
    return this.http.get(`${ROOT_API}/projects${param}`);
  }

  getProject(id: string) {
    return this.http.get(`${ROOT_API}/projects/${id}`);
  }

  addProject(project: any) {
    return this.http.post(`${ROOT_API}/projects`, project);
  }

  updateProject(id: string, project: any) {
    return this.http.put(`${ROOT_API}/projects/${id}`, project);
  }
}
