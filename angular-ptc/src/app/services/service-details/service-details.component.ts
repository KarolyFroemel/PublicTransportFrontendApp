import {Component, OnDestroy, OnInit} from '@angular/core';
import {ServicesService} from '../../shared/services.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ServiceWithStationsModel} from '../../models/service-with-stations.model';
import {ErrorHandlingService} from '../../shared/error-handling.service';
import {ErrorMessageModel} from '../../models/error-message.model';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.css']
})
export class ServiceDetailsComponent implements OnInit, OnDestroy {

  id: string;
  serviceWithStationsModel: ServiceWithStationsModel;
  serviceSubscription: Subscription;
  serviceChangedSubscription: Subscription;

  constructor(private serviceService: ServicesService,
              private route: ActivatedRoute,
              private router: Router,
              private errorHandler: ErrorHandlingService) { }

  ngOnInit() {
    this.serviceWithStationsModel = new ServiceWithStationsModel('', '', '', []);
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params.id;
          this.serviceSubscription = this.serviceService.getService(this.id).subscribe(
            response => {
              this.serviceWithStationsModel = response;
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

    this.serviceChangedSubscription = this.serviceService.serviceChanged.subscribe(
      () => {
        this.serviceSubscription = this.serviceService.getService(this.id).subscribe(
          response => {
            this.serviceWithStationsModel = response;
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

  ngOnDestroy(): void {
    this.serviceSubscription.unsubscribe();
  }

  onSubmit() {

  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDelete() {
    this.serviceService.deleteService(this.id);
    this.router.navigate(['/services']);
  }
}
