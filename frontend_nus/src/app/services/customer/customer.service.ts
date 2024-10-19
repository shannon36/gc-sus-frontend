import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from 'src/app/common/customer';
import { env } from 'src/app/env'

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  // private baseUrl = 'https://smartcart.nus.yaphanyee.com';
  // private baseUrl = 'http://localhost:9090';
  private baseUrl = env.API_URL;

  constructor(private httpClient: HttpClient) { }

  getCustomerInformation(email: string): Observable<Customer> {
    //const url = `${this.baseUrl}/Customers/customersEmail?custEmail=${email}`;
    const url = `${this.baseUrl}/Users/userEmail?email=${email}`;

    return this.httpClient.get<Customer>(url);
  }


}
