import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {TicketService} from '../../shared/ticket.service';
import {Subscription} from 'rxjs';
import {TicketType} from '../../models/ticket-type.model';
import {TicketSearchModel} from '../../models/ticket-search.model';
import {TicketModel} from '../../models/ticket.model';
import {UserServiceService} from '../../shared/user-service.service';
import {TicketSearchResponseModel} from '../../models/ticket-search-response.model';

@Component({
  selector: 'app-user-tickets-list',
  templateUrl: './user-tickets-list.component.html',
  styleUrls: ['./user-tickets-list.component.css']
})
export class UserTicketsListComponent implements OnInit, OnDestroy {

  ticketStatusTypes: string[] = ['Validated', 'Refunded', 'Can be used', 'Expired'];
  ticketTypes: TicketType[] = [];
  ticketSearchForm: FormGroup;
  ticketTypesChanged: Subscription;
  ticketSearchModel: TicketSearchModel;
  statusMap = new Map<string, string>([
    ['Validated', 'VALIDATED'],
    ['Refunded', 'REFUNDED'],
    ['Can be used', 'CAN_BE_USED'],
    ['Expired', 'EXPIRED']
  ]);
  userTicketList: TicketModel[] = [];
  xPage: number;
  xSize: number;
  xTotalPages: number;
  userListChanged: Subscription;

  constructor(private route: ActivatedRoute,
              private userService: UserServiceService,
              private ticketService: TicketService,
              private router: Router) { }

  ngOnInit() {
    this.ticketSearchModel = new TicketSearchModel('', '');
    this.ticketService.getTicketTypeList();
    this.ticketTypesChanged = this.ticketService.ticketTypeListChanged.subscribe(
      (ticketTypes: TicketType[]) => {
        this.ticketTypes = ticketTypes;
      }
    );

    this.ticketSearchForm = new FormGroup(
      {
        'ticketType': new FormControl(this.ticketSearchModel.ticketType),
        'ticketStatus': new FormControl(this.ticketSearchModel.status)
      }
    );

    this.xPage = 0;
    this.xSize = 5;
    this.xTotalPages = 0;

    this.userListChanged = this.userService.userTicketListChanged.subscribe(
      (response: TicketSearchResponseModel) => {
        this.xPage = response.xPage;
        this.xSize = response.xSize;
        this.xTotalPages = response.xTotalPages;
        this.userTicketList = response.services;
      }
    );

    this.userService.getUserTickets(this.ticketSearchModel, this.xPage, this.xSize);
  }

  onNewTicket() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onSubmit() {
    this.ticketSearchModel.ticketType = this.ticketSearchForm.get('ticketType').value;
    this.ticketSearchModel.status = this.statusMap.get(this.ticketSearchForm.get('ticketStatus').value);
    this.xPage = 0;
    this.userService.getUserTickets(this.ticketSearchModel, this.xPage, this.xSize);
  }

  onClear() {
    this.ticketSearchForm.reset();
  }

  previousPage() {
    this.userService.getUserTickets(this.ticketSearchModel, --this.xPage, this.xSize);
  }

  nextPage() {
    this.userService.getUserTickets(this.ticketSearchModel, ++this.xPage, this.xSize);
  }

  ngOnDestroy(): void {
    this.userListChanged.unsubscribe();
  }
}
