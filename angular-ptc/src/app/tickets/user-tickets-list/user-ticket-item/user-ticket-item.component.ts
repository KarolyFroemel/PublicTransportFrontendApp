import {Component, Input, OnInit} from '@angular/core';
import {TicketModel} from '../../../models/ticket.model';

@Component({
  selector: 'app-user-ticket-item',
  templateUrl: './user-ticket-item.component.html',
  styleUrls: ['./user-ticket-item.component.css']
})
export class UserTicketItemComponent implements OnInit {

  @Input() item: TicketModel;
  @Input() index: string;
  statusMap = new Map<string, string>([
    ["VALIDATED","Validated"],
    ["REFUNDED", "Refunded"],
    ["CAN_BE_USED", "Can be used"],
    ["EXPIRED", "Expired"]
  ]);

  constructor() { }

  ngOnInit() {
    console.log('ticket oninit: ' + this.item);
  }

}
