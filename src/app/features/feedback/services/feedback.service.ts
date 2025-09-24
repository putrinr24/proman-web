import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { AuthService } from '@features/auth/services/auth.service';
import { UserRoleEnum } from '@features/user/enums/user-role-enum';
import { BehaviorSubject } from 'rxjs';

const ROOT_API = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
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

  getFeedbacksByAttachment(attachmentId: string) {
    return this.http.get(`${ROOT_API}/feedbacks?attachment_id=${attachmentId}`);
  }

  // addFeedback(feedback: string) {
  //   return this.http.post(`${ROOT_API}/admin/feedbacks`, feedback);
  // }
  addFeedback(feedback: string) {
    const role = this.authService.getCurrentUserData.value.role;
    const isAdminAccess = [
      UserRoleEnum.OWNER,
      UserRoleEnum.PROJECT_MANAGER,
      UserRoleEnum.DEVELOPER,
    ].includes(role);

    const endpoint = isAdminAccess ? 'admin/feedbacks' : 'feedbacks';

    console.log('User Role:', role);
    console.log('Is Admin Access:', isAdminAccess);
    console.log('Endpoint:', `${ROOT_API}/${endpoint}`);
    console.log('Feedback Payload:', feedback);

    return this.http.post(`${ROOT_API}/${endpoint}`, feedback);
  }

  // addFeedback(feedback: string) {
  //   const isManager = this.authService.isManager;
  //   console.log(isManager);
  //   const endpoint = isManager ? 'admin/feedbacks' : 'feedbacks';
  //   console.log(endpoint);
  //   return this.http.post(`${ROOT_API}/${endpoint}`, feedback);
  // }

  updateFeedback(id: string, attachment: any) {
    return this.http.put(`${ROOT_API}/attachments/${id}`, attachment);
  }
}
