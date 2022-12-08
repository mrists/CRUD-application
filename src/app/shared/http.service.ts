import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICustomer } from './customer';

const url = 'https://realtime-db-aafe5-default-rtdb.europe-west1.firebasedatabase.app/customers';
const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  customers: ICustomer[] = [];

  constructor(private http: HttpClient) { }

  createData(customer: ICustomer): void {
    this.http.post<ICustomer>(`${url}.json`, customer, httpOptions).subscribe(
      (data: ICustomer) => this.customers.push({...{key: data.name, ...customer}}),
      catchError(this.errorHandler<ICustomer>('POST'))
    )
  }

  getData(): void {
    this.http.get<ICustomer>(`${url}.json`, httpOptions).subscribe(
      (res: any) => Object.keys(res).forEach(key => this.customers.push( {key, ...res[key]} )),
      catchError(this.errorHandler<ICustomer[]>('GET'))
    )
  }
  
  updateData(customer: ICustomer, i: number): void {
    const {key, ...data} = customer;
    this.http.put<ICustomer>(`${url}/${key}.json`, data, httpOptions).subscribe(
      () => this.customers[i] = customer,
      catchError(this.errorHandler<ICustomer>('PUT'))
    )
  }

  deleteData(customer: ICustomer): void {
    this.http.delete<ICustomer>(`${url}/${customer.key}.json`,httpOptions).subscribe(
      () => this.customers.splice(this.customers.indexOf(customer), 1),
      catchError(this.errorHandler<void>('DELETE'))
    )
  }

  private errorHandler<T>(operation: any, res?: T): any {
    return (error: any): Observable<T> => { 
      console.error(`${operation} failed ${error}`)
      return of(res as T)
    }
  }

}
