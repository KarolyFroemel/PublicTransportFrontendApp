import {Component, Input, OnInit} from '@angular/core';
import {TicketType} from '../../../models/ticket-type.model';

@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.css']
})
export class TicketItemComponent implements OnInit {

  @Input() ticket: TicketType;
  @Input() index: string;

  constructor() { }

  ngOnInit() {
  }

}
