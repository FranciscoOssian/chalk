import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'

export default class Core {
    constructor() {
      this.auth = auth;
      this.cloudStore = {
          fileStore: null,
          jsonStore: database
      };
      this.localDB = null;

    }
  }