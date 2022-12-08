import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../shared/http.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICustomer } from '../shared/customer';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.minLength(13)]],
    location: ['', [Validators.required, Validators.minLength(3)]]
  });

  name: AbstractControl = this.form.controls['name'];
  email: AbstractControl = this.form.controls['email'];
  mobile: AbstractControl = this.form.controls['mobile'];
  location: AbstractControl = this.form.controls['location'];

  constructor(private httpService: HttpService, private fb: FormBuilder) { }

  ngOnInit(): void {
    
  }

  changeFocus(form: FormGroup): void{
    let value = form.value;

    for(let key of Object.keys(value)) {
      if(value[key] === "" || form.controls[key].invalid) {
        const input: HTMLInputElement | null = document.querySelector(`#${key}`);
        if(input) input.focus();
        break;
      }
    }
  }

  onSubmit() {
    this.httpService.createData(this.form.value as ICustomer)
  }
}
