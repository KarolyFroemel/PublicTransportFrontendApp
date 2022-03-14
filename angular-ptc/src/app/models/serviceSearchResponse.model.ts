import {ServiceModel} from './service.model';

export class ServiceSearchResponseModel {
  constructor(public services: ServiceModel[],
              public xPage: number,
              public xSize: number,
              public xTotalPages: number,
              public xTotalSize: number) {
  }
}
