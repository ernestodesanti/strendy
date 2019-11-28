import {TagModel} from './TagModel';
import {UserModel} from './UserModel';

export class PostModel {

  public id: number;

  constructor(public status: string, public text: string, public timestamp: string, public title: string, public user: UserModel,
              public tags: TagModel[]) {

  }

}
