import { Component, OnInit } from '@angular/core';
import {TicketType} from '../../models/ticket-type.model';
import {TicketService} from '../../shared/ticket.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-ticket-type-list',
  templateUrl: './ticket-type-list.component.html',
  styleUrls: ['./ticket-type-list.component.css']
})
export class TicketTypeListComponent implements OnInit {

  tickets: TicketType[];

  ticketsChanged: Subscription;

  constructor(private ticketService: TicketService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.ticketService.getTicketTypeList();
    this.ticketsChanged = this.ticketService.ticketTypeListChanged.subscribe(
      (tickets: TicketType[]) => {
        this.tickets = tickets;
      }
    );
  }

  onNewTicket() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

}
