import { v4 } from 'uuid';
import Collection from './Collection.mjs';

export default class Node {
  constructor({
    firstUser
  }) {
    this.uuid = v4();

    this.users = new Collection();

    this.addUser({
      ...firstUser,
      isMaster: true
    });
  }

  addUser({ username, isMaster }) {
    const user = new User();
    this.users.set(user.uuid, user);
  }
}