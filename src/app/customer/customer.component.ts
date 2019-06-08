import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import {RestService} from '../rest.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customers: any;
  dataTable: any;
  showModal = false;


  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  mode: string;
  servicesSelected = {
    pp1: false,
    pp2: false,
    hi1: false,
    hctv: false
  };
  allServices = {};

  constructor(private rest: RestService, private chRef: ChangeDetectorRef) {
    this.mode = '';
    this.getAllServices();
  }
  ngOnInit() {
    const table: any = $('table');
    this.rest.getCustomers()
      .subscribe((data: any[]) => {
        this.customers = data;
        this.chRef.detectChanges();
        this.dataTable = table.DataTable();
      });
    this.resetServicesSelected();
  }
  resetServicesSelected() {
    this.servicesSelected = {
      pp1: false,
      pp2: false,
      hi1: false,
      hctv: false
    };
  }

  showCreateModal() {
    this.mode = 'Create';
    this.showModal = true;
    console.log('show modal');
  }
  toggleModal() {
    this.showModal = !this.showModal;
  }
  hideModal() {
    this.showModal = false;
  }
  createCustomer() {
    if (this.firstName === undefined || this.lastName === undefined || this.email === undefined || this.contact === undefined) {
      alert('Please enter all fields');
      return;
    }
    this.rest.addCustomer(this.firstName, this.lastName, this.email, this.contact)
      .subscribe(
        res => {
          const result = JSON.parse(JSON.stringify(res));
          if (result.status) {
            alert('Customer created successfully');
            this.showModal = false;
          } else {
            alert (result.message);
          }
        },
        it => {
          console.log(it);
          alert('An error occurred, please try again later');
        }
      );
  }

  loadVars(customer) {
    this.firstName = customer.firstName;
    this.lastName = customer.lastName;
    this.email = customer.email;
    this.contact = customer.contact;
  }

  viewCustomer(customer) {
    this.mode = 'View';
    this.loadVars(customer);

    this.rest.loadCustomerServices(customer.customer_id).subscribe(res => {
      console.log(res);
      this.resetServicesSelected();
      const result = JSON.parse(JSON.stringify(res));
      for (const row of result) {
        switch (row.service_id) {
          case 1:
            (this.servicesSelected).pp1 = true;
            break;
          case 2:
            this.servicesSelected.pp2 = true;
            break;
          case 3:
            this.servicesSelected.hi1 = true;
            break;
          case 4:
            this.servicesSelected.hctv = true;
            break;
        }
        console.log(row);

      }
    },
      () => {
      console.log('error');
      });

    this.chRef.detectChanges();
    this.toggleModal();
  }

  getAllServices() {
    this.rest.getServices().subscribe(res => {
      const result = JSON.parse(JSON.stringify(res));
      this.allServices = result.data;
    });
  }

}
