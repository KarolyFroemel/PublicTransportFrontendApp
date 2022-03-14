import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ServicesService} from '../../shared/services.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ServiceSearchModel} from '../../models/service-search.model';
import {Subscription} from 'rxjs';
import {ServiceModel} from '../../models/service.model';
import {ServiceSearchResponseModel} from '../../models/serviceSearchResponse.model';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit, OnDestroy {

  serviceTypes: string[] = ['Bus', 'Tram', 'Subway', 'Boat'];
  serviceSearchForm: FormGroup;
  servicesListChanged: Subscription;
  serviceChanged: Subscription;
  xPage: number;
  xSize: number;
  xTotalPages: number;
  services: ServiceModel[];
  serviceSearchModel: ServiceSearchModel;


  constructor(private route: ActivatedRoute,
              private servicesService: ServicesService,
              private router: Router) { }

  ngOnInit() {
    this.serviceSearchModel = new ServiceSearchModel('', '', 'name', 'ASC');
    this.serviceSearchForm = new FormGroup(
      {
        'name': new FormControl(this.serviceSearchModel.name),
        'serviceType': new FormControl(this.serviceSearchModel.type)
      }
    );

    this.xPage = 0;
    this.xSize = 5;
    this.xTotalPages = 0;

    this.servicesListChanged = this.servicesService.serviceListChanged.subscribe(
      (serviceSearchResponseModel: ServiceSearchResponseModel) => {
        this.xPage = serviceSearchResponseModel.xPage;
        this.xSize = serviceSearchResponseModel.xSize;
        this.xTotalPages = serviceSearchResponseModel.xTotalPages;
        this.services = serviceSearchResponseModel.services;
      }
    );

    this.serviceChanged = this.servicesService.serviceChanged.subscribe(
      () => {
        this.servicesService.getServiceList(this.serviceSearchModel, this.xPage, this.xSize);
      }
    );

    this.servicesService.getServiceList(this.serviceSearchModel, this.xPage, this.xSize);
  }

  onSubmit() {
    this.serviceSearchModel.name = this.serviceSearchForm.get('name').value;
    this.serviceSearchModel.type = this.serviceSearchForm.get('serviceType').value.toUpperCase();
    console.log(this.serviceSearchModel);
    this.xPage = 0;
    this.servicesService.getServiceList(this.serviceSearchModel, this.xPage, this.xSize);
  }

  onClear() {
    this.serviceSearchForm.reset();
  }

  ngOnDestroy(): void {
    this.servicesListChanged.unsubscribe();
  }

  nextPage() {
    this.servicesService.getServiceList(this.serviceSearchModel, ++this.xPage, this.xSize);
  }

  previousPage() {
    this.servicesService.getServiceList(this.serviceSearchModel, --this.xPage, this.xSize);
  }

  onNewService() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}
