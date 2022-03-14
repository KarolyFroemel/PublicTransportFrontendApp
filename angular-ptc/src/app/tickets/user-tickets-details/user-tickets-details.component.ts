import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TicketModel} from '../../models/ticket.model';
import {Subscription} from 'rxjs';
import {UserServiceService} from '../../shared/user-service.service';
import {ErrorMessageModel} from "../../models/error-message.model";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlingService} from "../../shared/error-handling.service";

@Component({
  selector: 'app-user-tickets-details',
  templateUrl: './user-tickets-details.component.html',
  styleUrls: ['./user-tickets-details.component.css']
})
export class UserTicketsDetailsComponent implements OnInit, OnDestroy {

  id: string;
  ticket: TicketModel;
  getTicketSubscription: Subscription;
  ticketChangedSubscription: Subscription;
  isValidationEnable = true;
  isRefundationEnable = true;

  statusMap = new Map<string, string>([
    ['VALIDATED', 'Validated'],
    ['REFUNDED', 'Refunded'],
    ['CAN_BE_USED', 'Can be used'],
    ['EXPIRED', 'Expired']
  ]);

  constructor(private userService: UserServiceService,
              private route: ActivatedRoute,
              private router: Router,
              private errorHandler: ErrorHandlingService) { }

  ngOnInit() {
    this.ticket = new TicketModel('', '', '', '', '', '', '', '', '');
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params.id;
          this.getTicketSubscription = this.userService.getTicket(this.id).subscribe(
            response => {
              this.ticket = response;
              this.isValidationEnable = (!!response.isEnforceable && response.status === 'CAN_BE_USED');
              this.isRefundationEnable = response.status == 'CAN_BE_USED';
            }, errorResponse => {
              const errorMessage: ErrorMessageModel = new ErrorMessageModel(
                errorResponse.status,
                errorResponse.error.errorCode,
                errorResponse.error.message,
                errorResponse.error.detailedMessage
              );
              this.errorHandler.errorOccured.next(errorMessage);
            }
          );
        }
      );

    this.ticketChangedSubscription = this.userService.ticketDataChanged.subscribe(
      () => {
        this.ngOnInit();
      }
    );
  }

  onValidate() {
    this.userService.validateTicket(this.id);
  }

  onRefund() {
    this.userService.refundTicket(this.id);
  }

  ngOnDestroy(): void {
    this.getTicketSubscription.unsubscribe();
    this.ticketChangedSubscription.unsubscribe();
  }

  convertToBoolean(input: string): boolean | undefined {
    try {
      return JSON.parse(input);
    } catch (e) {
      return undefined;
    }
  }

}
