import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';

import ThemeProvider from '@providers/theme';
import PinchableImage from '@components/common/PinchableImage';

function ImageViewer({ route }: any) {
  return <PinchableImage uri={route.params.list[0]} />;
}

const Main = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export default function (props: any) {
  return (
    <Main>
      <ThemeProvider>
        <StatusBar hidden />
        <ImageViewer {...props} />
      </ThemeProvider>
    </Main>
  );
}
