import {StationModel} from './station.model';

export class ServiceWithStationsModel {
  constructor(public id: string,
              public name: string,
              public type: string,
              public stations: StationModel[]) {
  }
}
