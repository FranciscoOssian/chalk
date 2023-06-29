import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const Accordion = ({ children, open, height }) => {
  const heightAnimation = useSharedValue(0);

  useEffect(() => {
    if (open === true) heightAnimation.value = height;
    if (open === false) heightAnimation.value = 0;
  }, [open]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(heightAnimation.value, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    };
  });

  return (
    <>
      <Main style={animatedStyle}>{children}</Main>
    </>
  );
};

const Main = styled(Animated.View)`
  width: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export default Accordion;
