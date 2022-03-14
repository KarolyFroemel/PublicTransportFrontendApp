import {UserAccountModel} from './user-account.model';

export class UserInfoModel {
  constructor(public id: string,
              public name: string,
              public email: string,
              public account: UserAccountModel) {
  }
}
