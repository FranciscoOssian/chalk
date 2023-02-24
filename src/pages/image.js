import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components';

import ThemeProvider from '../Providers/theme';
import PinchableImage from '../components/common/PinchableImage';

function ImageViewer({ route }) {
  return <PinchableImage uri={route.params.list[0]} />;
}

const Main = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export default function (props) {
  return (
    <Main>
      <ThemeProvider>
        <StatusBar hidden />
        <ImageViewer {...props} />
      </ThemeProvider>
    </Main>
  );
}
