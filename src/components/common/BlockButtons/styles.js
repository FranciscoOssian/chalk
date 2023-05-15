import styled from 'styled-components';

export const Wrapper = styled.View`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`;

export const Title = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 17px;
  /* identical to box height */

  letter-spacing: -0.15px;
  text-transform: uppercase;

  color: rgba(0, 0, 0, 0.35);
  width: 100%;
`;

export const Container = styled.View`
  width: 100%;
  margin: 25px 0 25px 0;
`;
