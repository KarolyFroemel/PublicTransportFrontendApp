import {TicketModel} from './ticket.model';

export class TicketSearchResponseModel {
  constructor(public services: TicketModel[],
              public xPage: number,
              public xSize: number,
              public xTotalPages: number,
              public xTotalSize: number) {
  }
}
