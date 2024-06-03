import { createRealmContext } from '@realm/react';
import schemas from '@services/realm/schemas';

const realmConfig = {
  schema: schemas,
};

export default createRealmContext(realmConfig);
