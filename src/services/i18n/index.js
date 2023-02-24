import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translations from '../../utils/translations.json';

const fabric = async () => {
  const lang = await AsyncStorage.getItem('AppLanguage');
  const def = await AsyncStorage.getItem('defaultAppLanguage');

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: lang ?? def,
    resources: {
      ...translations,
    },
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });
};

export default fabric;
