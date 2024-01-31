import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translations from '@utils/translations.json';
import localStorage from '../localStorage';

const fabric = async () => {
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: await localStorage('appLanguage').get(),
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
