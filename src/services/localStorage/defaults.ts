import { getLocales } from 'expo-localization';

export const appLanguage = getLocales()[0].languageTag;

export const genders = ['Woman', 'Man', 'Transgender', 'Non-Binary', 'Prefer not to state'];

export const matchingConfig = {
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
