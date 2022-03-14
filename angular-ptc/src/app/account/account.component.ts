import { Component, OnInit } from '@angular/core';
import {UserInfoModel} from '../models/user-info.model';
import {UserAccountModel} from '../models/user-account.model';
import {UserServiceService} from '../shared/user-service.service';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorMessageModel} from '../models/error-message.model';
import {ErrorHandlingService} from '../shared/error-handling.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  userInfo: UserInfoModel;
  isFillBalanceEnable: boolean;
  userDataChangedSubscription: Subscription;
  img = 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png';
  fillBalanceForm: FormGroup;

  constructor(private userService: UserServiceService,
              private errorHandler: ErrorHandlingService) { }

  ngOnInit() {
    this.isFillBalanceEnable = false;
    this.userInfo = new UserInfoModel('', '', '', new UserAccountModel('') );
    this.userService.getUserInfo().subscribe(
      response => {
        this.userInfo = response;
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

    this.fillBalanceForm = new FormGroup(
      {
        'amount': new FormControl(1, [Validators.min(1), Validators.max(1000000), Validators.required])
      }
    );

    this.userDataChangedSubscription = this.userService.userDataChanged.subscribe(
      () => {
        this.ngOnInit();
      }
    );
  }

  onFillBalance() {
    this.isFillBalanceEnable = !this.isFillBalanceEnable;
  }

  onCancel() {
    this.fillBalanceForm.reset();
    this.isFillBalanceEnable = false;
  }

  onSubmit() {
    this.userService.fillUserBalance(this.fillBalanceForm.get('amount').value);
  }
}
