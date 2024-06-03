import MatchConfigType from '@src/types/matchConfig';

export default async function updateRealmMatchConfig(
  realm: Realm,
  matchingConfig: MatchConfigType & { id: string }
) {
  if (!matchingConfig) return;

  const realmUserMatchConfig = realm.objectForPrimaryKey<MatchConfigType>(
    'MatchingConfig',
    matchingConfig.id
  );

  if (!realmUserMatchConfig) return;

  realm.write(() => {
    if (matchingConfig.from) realmUserMatchConfig.from = matchingConfig.from;
    if (matchingConfig.to) realmUserMatchConfig.to = matchingConfig.to;
    if (matchingConfig.lang) realmUserMatchConfig.lang = matchingConfig.lang;
    if (matchingConfig.genders) realmUserMatchConfig.genders = matchingConfig.genders;
  });
}
