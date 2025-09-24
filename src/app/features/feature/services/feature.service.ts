import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';

const ROOT_API = environment.API_URL;

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  constructor(private http: HttpClient) {}

  getFeatures(params: string) {
    return this.http.get(`${ROOT_API}/features${params}`);
  }

  getFeature(id: string) {
    return this.http.get(`${ROOT_API}/features/${id}`);
  }

  getFeaturesByProject(queryString: string, projectId: string) {
    return this.http.get(
      `${ROOT_API}/admin/features?project_id=${projectId}&${queryString}`
    );
  }

  // getFeaturesByProject(query: string) {
  //   return this.http.get(`${ROOT_API}/admin/features?${query}`);
  // }

  addFeature(feature: any) {
    return this.http.post(`${ROOT_API}/admin/features`, feature);
  }

  updateFeature(id: string, feature: any) {
    return this.http.put(`${ROOT_API}/admin/features/${id}`, feature);
  }

  deleteFeature(id: string) {
    return this.http.delete(`${ROOT_API}/admin/features/${id}`);
  }

  getFeatureStatuses() {
    return this.http.get(`${ROOT_API}/features/enums/feature-statuses`);
  }

  updateStatus(id: number, status: number) {
    return this.http.patch(`${ROOT_API}/admin/features/${id}/status`, {
      status,
    });
  }

  updateAssignedTo(id: number, assigned_to: number | null) {
    return this.http.patch(`${ROOT_API}/admin/features/${id}/assigned-to`, {
      assigned_to,
    });
  }
}
