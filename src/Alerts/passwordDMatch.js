import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

export default function ({ onPress }) {
  const { t } = useTranslation();
  return Alert.alert(
    t('The password do not match'),
    t('Please try one more time :( its for you safe'),
    [
      {
        text: t('try again'),
        onPress,
      },
    ]
  );
}
