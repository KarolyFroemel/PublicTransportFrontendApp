import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {TicketSearchModel} from '../models/ticket-search.model';
import {TicketSearchResponseModel} from '../models/ticket-search-response.model';
import {TicketModel} from '../models/ticket.model';
import {Subject} from 'rxjs';
import {UserInfoModel} from '../models/user-info.model';
import {ErrorMessageModel} from '../models/error-message.model';
import {ErrorHandlingService} from './error-handling.service';

@Injectable()
export class UserServiceService {

  url = 'http://localhost:8081';

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlingService) { }

  ticketDataChanged = new Subject();

  userTicketListChanged = new Subject<TicketSearchResponseModel>();

  userDataChanged = new Subject();

  getUserTickets(search: TicketSearchModel, xPage: number, xSize: number) {
    if ( search.status === '' ) {
      search.status = null;
    }

    this.http.post<TicketModel[]>(
      this.url + '/ticket/search',
      search,
      {
        headers: new HttpHeaders()
          .set('X-Page', xPage.toString())
          .set('X-Size', xSize.toString()),
        observe: 'response'
      }
    ).subscribe(
      resp => {
        const responseModel: TicketSearchResponseModel = new TicketSearchResponseModel(
          resp.body,
          +resp.headers.get('X-Page'),
          +resp.headers.get('X-Size'),
          +resp.headers.get('X-Total-Pages'),
          +resp.headers.get('X-Total-Size')
        );
        this.userTicketListChanged.next(responseModel);
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

  getTicket(id: string) {
    return this.http
      .get<TicketModel>(
        this.url + '/ticket/' + id,
      );
  }

  refundTicket(ticketId: string) {
    this.http.delete(this.url + '/ticket/refund/' + ticketId).subscribe(
      response => {
        this.ticketDataChanged.next();
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

  validateTicket(ticketId: string) {
    this.http.put(this.url + '/ticket/validateTicket/' + ticketId, null).subscribe(
      response => {
        this.ticketDataChanged.next();
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

  getUserInfo() {
    return this.http
      .get<UserInfoModel>(
        this.url + '/user',
      );
  }

  fillUserBalance(amount: number) {
    this.http
      .put(
        this.url + '/user/fillBalance', {
          'addBalance': amount
        }
      ).subscribe(
        response => {
          this.userDataChanged.next();
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

  purchaseTicket(ticketId: string, date: string) {
    this.http
      .post<any>(
        this.url + '/ticket/purchaseTicket', {
          'ticketId': ticketId,
          'validFrom': date
        }
      ).subscribe(
      response => {
        this.getUserTickets(new TicketSearchModel('', ''), 0, 5);
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
}
