import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TicketType} from '../../models/ticket-type.model';
import {TicketService} from '../../shared/ticket.service';
import {Subscription} from 'rxjs';
import {UserServiceService} from '../../shared/user-service.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrls: ['./new-ticket.component.css']
})
export class NewTicketComponent implements OnInit {

  ticketPurchaseForm: FormGroup;
  ticketTypes: TicketType[] = [];
  ticketTypesChanged: Subscription;
  currentDate:any = new Date();

  constructor(private ticketService: TicketService,
              private userService: UserServiceService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.ticketPurchaseForm = new FormGroup({
      'ticketType': new FormControl('', Validators.required),
      'description': new FormControl(''),
      'validFrom': new FormControl(this.currentDate, Validators.required)
    });

    this.ticketService.getTicketTypeList();
    this.ticketTypesChanged = this.ticketService.ticketTypeListChanged.subscribe(
      (ticketTypes: TicketType[]) => {
        this.ticketTypes = ticketTypes;
      }
    );
  }

  onSubmit(selectedIndex: number) {
    console.log(this.ticketPurchaseForm.get('validFrom').value);

    this.userService.purchaseTicket(this.ticketTypes[selectedIndex].id, this.ticketPurchaseForm.get('validFrom').value);
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onClear() {
    this.ticketPurchaseForm.reset();
  }

  onChange(selectedIndex: number) {
    console.log(selectedIndex);
    this.ticketPurchaseForm.patchValue({'description': this.ticketTypes[selectedIndex].description});
  }
}
