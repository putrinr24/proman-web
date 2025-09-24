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
export class SaleInvoiceService {
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

  getSaleInvoices(
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
      // Cek apakah sudah ada tanda tanya di awal
      if (!param.includes('?')) {
        param = param.concat('?q=' + dataListParameter.searchQuery);
      } else {
        param = param.concat('&q=' + dataListParameter.searchQuery);
      }
    }

    if (dataListParameter.queryString) {
      param += dataListParameter.queryString;
    }

    const isManager = this.authService.isManager;
    const endpoint = isManager ? 'admin/sale-invoices' : 'sale-invoices';

    return this.http.get(`${ROOT_API}/${endpoint}${param}`);
  }

  getSaleInvoice(id: string) {
    const isManager = this.authService.isManager;
    const endpoint = isManager ? 'admin/sale-invoices' : 'sale-invoices';

    return this.http.get(`${ROOT_API}/${endpoint}/${id}`);
  }

  addSaleInvoice(saleInvoice: any) {
    return this.http.post(`${ROOT_API}/admin/sale-invoices`, saleInvoice);
  }

  updateSaleInvoice(id: string, saleInvoice: any) {
    return this.http.put(`${ROOT_API}/admin/sale-invoices/${id}`, saleInvoice);
  }

  deleteSaleInvoice(id: string) {
    return this.http.delete(`${ROOT_API}/admin/sale-invoices/${id}`);
  }

  // approveSaleInvoice(id: string) {
  //   return this.http.put(`${ROOT_API}/admin/sale-invoices/${id}/approve`, {})
  // }
}
