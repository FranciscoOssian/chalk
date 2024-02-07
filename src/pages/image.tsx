import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';
import LottieView from 'lottie-react-native';

import ThemeProvider from '@providers/theme';
import PinchableImage from '@components/common/PinchableImage';
import useFirstTimeCheck from '@src/hooks/useFirstTimeCheck';

const Main = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const Overlay = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  background-color: rgba(0, 0, 0, 0.5); /* Opacidade baixa */
`;

export default function ImageViewer({ route }: any) {
  const [showAnimation, setShowAnimation] = useState(false);

  const firstTimeOpenImage = useFirstTimeCheck('openImage');

  useEffect(() => {
    if (!firstTimeOpenImage && firstTimeOpenImage !== undefined) return;
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 1000);
    const hideTimer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [firstTimeOpenImage]);

  return (
    <Main>
      <ThemeProvider>
        <StatusBar hidden />
        <PinchableImage uri={route.params.list[0]} />
        {showAnimation && (
          <Overlay>
            <LottieView
              autoPlay
              loop={false}
              style={{ width: 200, height: 200 }}
              source={require('../../assets/Animation-pinch.json')}
            />
          </Overlay>
        )}
      </ThemeProvider>
    </Main>
  );
}
