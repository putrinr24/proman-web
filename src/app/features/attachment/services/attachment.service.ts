import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { AuthService } from '@features/auth/services/auth.service';
import { UserRoleEnum } from '@features/user/enums/user-role-enum';
import { DataListParameter } from '@shared/interfaces/data-list-parameter.interface';
import { BehaviorSubject } from 'rxjs';

const ROOT_API = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
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

  getAttachments(
    dataListParameter: DataListParameter = {} as DataListParameter
  ) {
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
    return this.http.get(`${ROOT_API}/admin/attachments${param}`);
  }

  getAttachmentsByProject(
    projectId: string,
    dataListParameter: DataListParameter = {} as DataListParameter
  ) {
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
    return this.http.get(
      `${ROOT_API}/admin/attachments?feature-project_id=${projectId}${param}`
    );
  }

  getAttachmentById(id: string) {
    const role = this.authService.getCurrentUserData.value.role;
    const isAdminAccess = [
      UserRoleEnum.OWNER,
      UserRoleEnum.PROJECT_MANAGER,
      UserRoleEnum.DEVELOPER,
    ].includes(role);

    const endpoint = isAdminAccess ? 'admin/attachments' : 'attachments';

    return this.http.get(`${ROOT_API}/${endpoint}/${id}`);
  }

  addAttachment(attachment: FormData) {
    return this.http.post(`${ROOT_API}/admin/attachments`, attachment);
  }

  updateAttachment(id: string, attachment: any) {
    return this.http.put(`${ROOT_API}/admin/attachments/${id}`, attachment);
  }

  deleteAttachment(id: string) {
    return this.http.delete(`${ROOT_API}/admin/attachments/${id}`);
  }

  deleteAttachmentFile(attachmentId: string, id: string) {
    return this.http.delete(
      `${ROOT_API}/attachments/${attachmentId}/files/${id}`
    );
  }

  addAttachmentFile(attachmentId: string, file: FormData) {
    return this.http.post(
      `${ROOT_API}/attachments/${attachmentId}/files`,
      file
    );
  }
}
