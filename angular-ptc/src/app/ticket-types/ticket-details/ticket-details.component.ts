import {Component, OnDestroy, OnInit} from '@angular/core';
import {TicketService} from '../../shared/ticket.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TicketType} from '../../models/ticket-type.model';
import {Subscription} from 'rxjs';
import {ErrorMessageModel} from "../../models/error-message.model";
import {ErrorHandlingService} from "../../shared/error-handling.service";

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit, OnDestroy {
  id: string;
  ticket: TicketType = new TicketType('', '', '', 0,0, '', false);
  private subscription: Subscription;
  private ticketTypeChanged: Subscription;

  constructor(private ticketService: TicketService,
              private route: ActivatedRoute,
              private router: Router,
              private errorHandler: ErrorHandlingService) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          // this.id = +params['id'];
          this.id = params.id;

          this.subscription = this.ticketService.getTicketType(this.id).subscribe(
            response => {
              this.ticket = response;
            }, error => {
              const errorMessage: ErrorMessageModel = new ErrorMessageModel(
                error.status,
                error.error.errorCode,
                error.error.message,
                error.error.detailedMessage
              );
              this.errorHandler.errorOccured.next(errorMessage);
            }
          );
        }
      );
    this.ticketTypeChanged = this.ticketService.ticketTypeChanged.subscribe(
      () => {
        this.subscription = this.ticketService.getTicketType(this.id).subscribe(
          response => {
            this.ticket = response;
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
  }

  onDelete() {
    this.ticketService.removeTicketType(this.ticket.id);
    this.router.navigate(['/tickets']);
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.ticketTypeChanged.unsubscribe();
  }
}
