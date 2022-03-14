import {Component, OnDestroy, OnInit} from '@angular/core';
import {ErrorHandlingService} from './shared/error-handling.service';
import {Subscription} from 'rxjs';
import {ErrorMessageModel} from './models/error-message.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  error: ErrorMessageModel = null;
  errorSubscription: Subscription;

  constructor(private errorHandler: ErrorHandlingService) {}

  ngOnInit() {
    this.errorSubscription = this.errorHandler.errorOccured.subscribe(
      (errorModel: ErrorMessageModel) => {
        this.error = errorModel;
      }
    );
  }


  onOkError() {
    this.error = null;
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}
