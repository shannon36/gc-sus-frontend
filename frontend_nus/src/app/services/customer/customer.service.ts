import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from 'src/app/common/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  // private baseUrl = 'https://smartcart.nus.yaphanyee.com';
  private baseUrl = 'http://localhost:9090';

  constructor(private httpClient: HttpClient) { }

  getCustomerInformation(email: string): Observable<Customer> {
    //const url = `${this.baseUrl}/Customers/customersEmail?custEmail=${email}`;
    const url = `${this.baseUrl}/User/userEmail?userEmail=${email}`;

    return this.httpClient.get<Customer>(url);
  }


}
