import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {ServicesService} from '../../shared/services.service';
import {ServiceModel} from '../../models/service.model';
import {Subscription} from 'rxjs';
import {ServiceWithStationsModel} from '../../models/service-with-stations.model';
import {NewServiceModel} from '../../models/new-service.model';
import {StationModel} from '../../models/station.model';
import {ErrorMessageModel} from '../../models/error-message.model';
import {ErrorHandlingService} from '../../shared/error-handling.service';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.css']
})
export class EditServiceComponent implements OnInit, OnDestroy {

  id: string;
  editMode = false;
  serviceForm: FormGroup;
  serviceWithStationsModel: ServiceWithStationsModel;
  serviceTypes: string[] = ['Bus', 'Tram', 'Subway', 'Boat'];
  serviceSubscription: Subscription;
  stationListChanged: Subscription;
  newStationAdded: Subscription;
  stationList: StationModel[] = [];
  newStationName: string;

  constructor(private route: ActivatedRoute,
              private serviceService: ServicesService,
              private router: Router,
              private errorHandler: ErrorHandlingService) { }

  ngOnInit() {
    this.serviceWithStationsModel = new ServiceWithStationsModel('', '', '', []);
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
    this.newStationAdded = this.serviceService.newStationAdded.subscribe(
      () => {
        this.initForm();
      }
    );

  }

  capitalize (s: string) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  private initForm() {

    const stations = new FormArray([]);
    if ( this.editMode ) {
      this.serviceSubscription = this.serviceService.getService(this.id).subscribe(
        response => {
          this.serviceWithStationsModel = response;

          if ( this.serviceWithStationsModel.stations ) {
            for (let station of this.serviceWithStationsModel.stations) {
              stations.push(
                new FormGroup({
                  'name': new FormControl(station.name, Validators.required)
                })
              );
            }
          }

          this.serviceForm = new FormGroup({
            'name': new FormControl(this.serviceWithStationsModel.name, Validators.required),
            'serviceType': new FormControl(this.capitalize(this.serviceWithStationsModel.type.toLowerCase())),
            'stations': stations
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

    this.serviceForm = new FormGroup({
      'name': new FormControl(this.serviceWithStationsModel.name, Validators.required),
      'serviceType': new FormControl(this.capitalize(this.serviceWithStationsModel.type.toLowerCase())),
      'stations': stations
    });

    this.serviceService.getStationList('');
    this.stationListChanged = this.serviceService.stationListChanged.subscribe(
      (resp: StationModel[]) => {
        this.stationList = resp;
      }
    );
  }

  onSubmit() {
    if (this.editMode) {
      const modifiedService: ServiceModel = new ServiceModel(
        this.serviceWithStationsModel.id,
        this.serviceForm.get('name').value,
        this.serviceForm.get('serviceType').value.toUpperCase(),
      );
      console.log(modifiedService);
      this.serviceService.updateService(modifiedService);
    } else {
      const newService: NewServiceModel = new NewServiceModel(
        this.serviceForm.get('name').value,
        this.serviceForm.get('serviceType').value.toUpperCase(),
      );
      this.serviceService.addNewService(newService);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteStation(i: number) {
    const mo: StationModel[] = (<FormArray>this.serviceForm.get('stations')).getRawValue();
    for (let index = 0; index < this.serviceWithStationsModel.stations.length; index++) {
      if (mo[i].name === this.serviceWithStationsModel.stations[index].name) {
        this.serviceService.deleteStation(this.serviceWithStationsModel.id, this.serviceWithStationsModel.stations[index].id);
      }
    }
  }

  ngOnDestroy(): void {
    if ( this.serviceSubscription ) {
      this.serviceSubscription.unsubscribe();
    }
    this.stationListChanged.unsubscribe();
    this.newStationAdded.unsubscribe();

  }

  onAddStation(value: string) {
    let findstation = false;
    if (value !== '') {
      for (let i = 0; i < this.stationList.length; i++) {
        if (value === this.stationList[i].name) {
          findstation = true;
        }
      }
    }

    if ( !findstation ) {
      this.serviceService.addNewStation(value, this.serviceWithStationsModel.id);
    } else {

    }
    this.newStationName = '';
  }
}
