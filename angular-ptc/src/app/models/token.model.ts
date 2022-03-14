export class TokenModel {
  constructor(public accessToken: string,
              public expiresIn: string,
              public notBeforePolicy: string,
              public refreshExpiresIn: string,
              public refreshToken: string,
              public scope: string,
              public sessionState: string,
              public tokenType: string
              ) {
  }
}
