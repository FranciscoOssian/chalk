import React from 'react';
import { render } from '@testing-library/react-native';
import AppWrapper from './App';

test('renders without crashing', () => {
  render(<AppWrapper />);
});
