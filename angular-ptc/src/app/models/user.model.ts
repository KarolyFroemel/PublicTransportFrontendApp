export class User {
  constructor(public username: string,
              public email: string,
              private accessToken: string,
              public role: string,
              private tokenExpirationDate: Date) {
  }

  get token() {
    if (new Date() > this.tokenExpirationDate) {
      return null;
    }
    return this.accessToken;
  }
}
