export class TicketType {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public price: number,
    public expirationTime: number,
    public imgSource: string,
    public isEnforceable: boolean
  ) {
  }
}
