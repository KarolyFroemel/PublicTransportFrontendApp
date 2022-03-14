export class ErrorMessageModel {
  constructor(public htmlMessage: string,
              public errorCode: string,
              public errorMessage: string,
              public errorDetailedMessage: string) {
  }
}
