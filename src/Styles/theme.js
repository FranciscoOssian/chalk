import { DefaultTheme } from '@react-navigation/native';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0584FE',
    textGreyBackground: '#999999',
    alert: '#FE294D',
    done: '#34C759',
  },
  fonts: {
    Assistant: './assets/fonts/Assistant-VariableFont_wght.ttf',
  },
};

export default theme;
