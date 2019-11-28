import {TagModel} from './TagModel';

export class UserModel {

  public id: number;

  constructor(public nickname: string, public status: string, public preferences: TagModel[]) {

  }

}
