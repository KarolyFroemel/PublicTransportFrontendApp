import { Injectable } from '@angular/core';
import {TicketType} from '../models/ticket-type.model';
import {Subject} from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import {ErrorHandlingService} from './error-handling.service';
import {ErrorMessageModel} from '../models/error-message.model';

@Injectable()
export class TicketService {
  url = 'http://localhost:8081';

  ticketTypeListChanged = new Subject<TicketType[]>();
  ticketTypeChanged = new Subject();

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlingService) { }

  addNewTicketType(ticket: TicketType) {
    this.http.post(
      this.url + '/ticketType',
      ticket
    ).subscribe(
      response => {
        this.getTicketTypeList();
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

  removeTicketType(id: string) {
    this.http.delete(
      this.url + '/ticketType/' + id
    ).subscribe(
      response => {
        this.getTicketTypeList();
      },
      errorResponse => {
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

  getTicketType(id: string) {
    return this.http.get<TicketType>(this.url + '/ticketType/' + id);
  }

  updateTicketType(ticket: TicketType) {
    this.http.put(this.url + '/ticketType',
      ticket).subscribe(
        response => {
          this.getTicketTypeList();
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

  getTicketTypeList() {
    this.http
      .get<TicketType[]>(
        this.url + '/ticketType',
      )
      .subscribe(
        responseData => {
          this.ticketTypeListChanged.next(responseData.slice());
        },
        errorResponse => {
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
}
