import { useTheme } from '@react-navigation/native';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

const ThemeProvider = ({ children }) => {
  const theme = useTheme();
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
};

export default ThemeProvider;
