import { usePreventScreenCapture } from 'expo-screen-capture';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const Main = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Photo = styled.View`
  width: 100%;
  height: ${(p) => p.height};
  flex: 1;
`;

const AnimatedImage = Animated.createAnimatedComponent(Image);

const { width, height } = Dimensions.get('window');

function PinchableImage({ uri }) {
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  usePreventScreenCapture();

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    },
    onEnd: () => {
      scale.value = withTiming(1);
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { translateX: -width / 2 },
        { translateY: -height / 2 },
        { scale: scale.value },
        { translateX: -focalX.value },
        { translateY: -focalY.value },
        { translateX: width / 2 },
        { translateY: height / 2 },
      ],
    };
  });

  const focalPointStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: focalX.value }, { translateY: focalY.value }],
    };
  });

  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    Image.getSize(uri, (w, h) => setImageHeight(h));
  }, [uri]);

  return (
    <Main>
      <Photo height={imageHeight + 'px'}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PinchGestureHandler onGestureEvent={pinchHandler}>
            <Animated.View style={{ flex: 1 }}>
              <AnimatedImage style={[{ flex: 1 }, rStyle]} source={{ uri }} resizeMode="contain" />
              <Animated.View style={[styles.focalPoint, focalPointStyle]} />
            </Animated.View>
          </PinchGestureHandler>
        </GestureHandlerRootView>
      </Photo>
    </Main>
  );
}

export default PinchableImage;

const styles = StyleSheet.create({
  focalPoint: {
    ...StyleSheet.absoluteFillObject,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
  },
});
