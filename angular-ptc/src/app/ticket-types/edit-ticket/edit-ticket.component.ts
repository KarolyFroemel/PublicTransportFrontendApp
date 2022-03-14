import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TicketService} from '../../shared/ticket.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TicketType} from '../../models/ticket-type.model';
import {Subscription} from 'rxjs';
import {ErrorMessageModel} from "../../models/error-message.model";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlingService} from "../../shared/error-handling.service";

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent implements OnInit, OnDestroy {

  id: string;
  editMode = false;
  ticketForm: FormGroup;
  ticket: TicketType = new TicketType('', '', '', 0, 0, '', false);
  private subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private ticketService: TicketService,
              private router: Router,
              private errorHandler: ErrorHandlingService) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          // this.id = params['id'];
          this.id = params.id;
          // this.editMode = params['id'] != null;
          this.editMode = params.id != null;
          this.initForm();
        }
      );
  }

  private initForm() {

    if (this.editMode) {
      this.subscription = this.ticketService.getTicketType(this.id).subscribe(
        response => {
          this.ticket = response;

          this.ticketForm = new FormGroup({
            'name': new FormControl(this.ticket.name, Validators.required),
            'imagePath': new FormControl(this.ticket.imgSource, Validators.required),
            'description': new FormControl(this.ticket.description, Validators.required),
            'price': new FormControl(this.ticket.price, Validators.required),
            'expirationTime': new FormControl(this.ticket.expirationTime, Validators.required),
            'isEnforceable': new FormControl(this.ticket.isEnforceable, Validators.required)
          });
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

    this.ticketForm = new FormGroup({
      'name': new FormControl(this.ticket.name, Validators.required),
      'imagePath': new FormControl(this.ticket.imgSource, Validators.required),
      'description': new FormControl(this.ticket.description, Validators.required),
      'price': new FormControl(this.ticket.price, Validators.required),
      'expirationTime': new FormControl(this.ticket.expirationTime, Validators.required),
      'isEnforceable': new FormControl(this.ticket.isEnforceable, Validators.required)
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.ticket.name = this.ticketForm.get('name').value;
      this.ticket.description = this.ticketForm.get('description').value;
      this.ticket.imgSource = this.ticketForm.get('imagePath').value;
      this.ticket.price = this.ticketForm.get('price').value;
      this.ticket.expirationTime = this.ticketForm.get('expirationTime').value;
      this.ticket.isEnforceable = this.ticketForm.get('isEnforceable').value;
      console.log(this.ticket);
      this.ticketService.updateTicketType(this.ticket);
    } else {
      this.ticket = new TicketType(
        '',
        this.ticketForm.get('name').value,
        this.ticketForm.get('description').value,
        this.ticketForm.get('price').value,
        this.ticketForm.get('expirationTime').value,
        this.ticketForm.get('imagePath').value,
        this.ticketForm.get('isEnforceable').value
      );
      console.log(this.ticket);
      this.ticketService.addNewTicketType(this.ticket);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
    if ( this.subscription ) {
      this.subscription.unsubscribe();
    }

  }
}
