export class TicketModel {
  constructor(public id: string,
              public name: string,
              public purchaseDate: string,
              public validFrom: string,
              public validTo: string,
              public validationTime: string,
              public status: string,
              public imgSource: string,
              public isEnforceable: string) {
  }
}
