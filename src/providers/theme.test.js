import React from 'react';
import { render } from '@testing-library/react-native';
import ThemeProvider from './theme'; // Substitua pelo caminho real para o seu arquivo ThemeProvider

// Mock da função useTheme
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    primaryColor: 'blue',
    backgroundColor: 'white',
    // Adicione as propriedades do seu tema aqui
  }),
}));

describe('ThemeProvider', () => {
  it('should call without break', () => {
    const childComponent = React.createElement('div', { 'data-testid': 'child-component' });
    render(React.createElement(ThemeProvider, null, childComponent));
  });
});
