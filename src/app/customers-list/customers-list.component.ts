import { Component, OnInit } from '@angular/core';
import { ICustomer } from '../shared/customer';
import { HttpService } from '../shared/http.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {

  editingPosition: number | null = null;
  isChanged: boolean = false;
  private tempCustomer!: ICustomer;

  constructor(public httpService: HttpService) { }

  ngOnInit(): void {
    this.httpService.getData()
  }

  editCustomer(id: number): void {
    this.tempCustomer = this.resetCustomer();
    this.editingPosition = id;
  }

  cancelEditing(): void {
    this.editingPosition = null;
    this.isChanged = false;
  }

  deleteCustomer(customer: ICustomer): void {
    this.httpService.deleteData(customer)
  }

  saveCustomer(customer: ICustomer, i: number): void {
    if(this.isChanged) {
      const mergedCustomer = this.mergeCustomer<ICustomer>(customer, this.tempCustomer);
      
      this.httpService.updateData(mergedCustomer, i)

      this.editingPosition = null;
      this.isChanged = false;
    }
  }

  setValue(key: string, value: string, origin: string) : void {
    const trimedValue = value.trim();

    if ((trimedValue !== origin) && (trimedValue !== this.tempCustomer[key as keyof ICustomer])) {
      this.tempCustomer[key as keyof ICustomer] = trimedValue
      this.isChanged = true;
    }
  }

  private mergeCustomer<T>(origin: T, temp: T): T {
    const result = {...origin}
    Object.keys(temp as any).forEach(key => {
      if(temp[key as keyof T]) {
        result[key as keyof T] = temp[key as keyof T]
      }
    })
    return result
  }

  private resetCustomer = (): ICustomer => ({
    key: null, 
    name: null, 
    email: null, 
    mobile: null,
    location: null
  })
}
