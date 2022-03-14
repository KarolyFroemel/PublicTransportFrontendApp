import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {ErrorMessageModel} from '../models/error-message.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  errorOccured = new Subject<ErrorMessageModel>();

  constructor() { }

  throwError(errorModel: ErrorMessageModel) {
    this.errorOccured.next(errorModel);
  }
}
