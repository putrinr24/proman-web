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
export class SalePaymentService {
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

  getSalePayments(
    dataListParameter: DataListParameter = {} as DataListParameter
  ) {
    let param = '';
    if (dataListParameter.rows && dataListParameter.page) {
      param = param.concat(
        `?page=${dataListParameter.page}&limit=${dataListParameter.rows}`
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
    return this.http.get(`${ROOT_API}/admin/sale-payments${param}`);
  }

  getSalePayment(id: string) {
    return this.http.get(`${ROOT_API}/admin/sale-payments/${id}`);
  }

  addSalePayment(data: any) {
    return this.http.post(`${ROOT_API}/admin/sale-payments`, data);
  }

  updateSalePayment(id: string, salePayment: any) {
    return this.http.put(`${ROOT_API}/admin/sale-payments/${id}`, salePayment);
  }

  deleteSalePayment(id: string) {
    return this.http.delete(`${ROOT_API}/admin/sale-payments/${id}`);
  }

  approveSalePayment(id: string) {
    return this.http.put(`${ROOT_API}/admin/sale-payments/${id}/status`, {
      status: 1,
    });
  }

  cancelSalePayment(id: string) {
    return this.http.put(`${ROOT_API}/admin/sale-payments/${id}/status`, {
      status: 2,
    });
  }

  getSnapToken(salePaymentId: any) {
    return this.http.get(
      ROOT_API + 'admin/sale-payments/' + salePaymentId + '/snap-payment'
    );
  }
}
