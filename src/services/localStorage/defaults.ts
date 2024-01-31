import { getLocales } from 'expo-localization';

const appLanguage = getLocales()[0].languageTag;

const genders = ['Woman', 'Man', 'Transgender', 'Non-Binary', 'Prefer not to state'];

const matchingConfig = {
  from: 18,
  to: 18,
  lang: appLanguage,
  genders: genders,
};

const exportList: [string, any][] = [];

exportList.push(['appLanguage', appLanguage]);
exportList.push(['genders', genders]);
exportList.push(['matchingConfig', matchingConfig]);

export default exportList;
