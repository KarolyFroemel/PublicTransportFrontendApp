import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {ServiceModel} from '../models/service.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ServiceSearchModel} from '../models/service-search.model';
import {ServiceSearchResponseModel} from '../models/serviceSearchResponse.model';
import {ServiceWithStationsModel} from '../models/service-with-stations.model';
import {NewServiceModel} from '../models/new-service.model';
import {StationSearchModel} from '../models/station-search.model';
import {StationModel} from '../models/station.model';
import {CreateStationModel} from '../models/create-station.model';
import {ErrorHandlingService} from './error-handling.service';
import {ErrorMessageModel} from '../models/error-message.model';

@Injectable()
export class ServicesService {

  url = 'http://localhost:8081';
  serviceListChanged = new Subject<ServiceSearchResponseModel>();
  stationListChanged = new Subject<StationModel[]>();
  serviceChanged = new Subject();
  newStationAdded = new Subject();
  stationDeleted = new Subject();

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlingService) { }

  deleteService(id: string) {
    this.http.delete(this.url + '/service/' + id).subscribe(
      response => {
        this.serviceChanged.next();
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

  getService(id: string) {
    return this.http
      .get<ServiceWithStationsModel>(
        this.url + '/service/' + id,
      );
  }

  getServiceList(search: ServiceSearchModel, xPage: number, xSize: number) {
    const headers = new HttpHeaders()
      .set('X-Page', '0')
      .set('X-Size', '100');

    if(search.type === '') {
      search.type = null;
    }

    this.http.post<ServiceModel[]>(
      this.url + '/service/search',
      search,
      {
        headers: new HttpHeaders()
          .set('X-Page', xPage.toString())
          .set('X-Size', xSize.toString()),
        observe: 'response'
      }
    ).subscribe(
      resp => {
        console.log(resp.body);
        console.log('response: ' + resp.headers.keys());
        const responseModel: ServiceSearchResponseModel = new ServiceSearchResponseModel(
          resp.body,
          +resp.headers.get('X-Page'),
          +resp.headers.get('X-Size'),
          +resp.headers.get('X-Total-Pages'),
          +resp.headers.get('X-Total-Size')
        );
        this.serviceListChanged.next(responseModel);
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

  updateService(myService: ServiceModel) {
    this.http.put(this.url + '/service', myService).subscribe(
      response => {
        this.serviceChanged.next();
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

  addNewService(newService: NewServiceModel) {
    this.http.post(this.url + '/service', newService).subscribe(
      response => {
        this.serviceChanged.next();
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

  addNewStation(name: string, serviceId: string) {
    const createStation: CreateStationModel = new CreateStationModel(name);
    this.http.post<StationModel>(
      this.url + '/station',
      createStation
    ).subscribe(
      resp => {
        const stationId: string = resp.id;
        this.addStationToService(serviceId, stationId);
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

  addStationToService(serviceId: string, stationId: string) {
    this.http.put(
      this.url + '/service/' + serviceId + '/station/' + stationId, null
    ).subscribe(
      resp => {
        this.newStationAdded.next();
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

  deleteStation(serviceId: string, stationId: string) {
    this.http.delete(
      this.url + '/service/' + serviceId + '/station/' + stationId
    ).subscribe(
      resp => {
        this.newStationAdded.next();
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

  getStationList(name: string) {
    const mySearch: StationSearchModel = new StationSearchModel(name, 'name', 'ASC');
    this.http.post<StationModel[]>(
      this.url + '/station/search',
      mySearch,
      {
        headers: new HttpHeaders()
          .set('X-Page', '0')
          .set('X-Size', '10000000'),
        observe: 'response'
      }
    ).subscribe(
      resp => {
        this.stationListChanged.next(resp.body);
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
