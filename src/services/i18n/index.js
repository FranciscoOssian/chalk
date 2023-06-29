import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translations from '@utils/translations.json';

import { defaultAppLanguage } from '@utils/defaultStorage.ts';

const fabric = async () => {
  const lang = await AsyncStorage.getItem('AppLanguage');

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: lang ?? defaultAppLanguage,
    resources: {
      ...translations,
    },
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    fallbackLng: 'en',
    keySeparator: false,
  });
};

export default fabric;
