import styled from 'styled-components';

export const Message = styled.View`
  background-color: ${(p) => (p.my ? p.theme.colors.primary : 'rgba(0, 0, 0, 0.06)')};
  border-radius: 18px;

  min-width: 50%;
  max-width: 90%;
  width: auto;

  height: auto;

  margin: 10px;
  padding: ${(p) => (p.type === 'image' ? 0 : 10)}px;

  justify-content: center;
  align-items: flex-start;
`;

export const Txt = styled.Text`
  //font-family: 'Assistant';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;

  flex-direction: row;

  color: ${(p) => (p.my ? 'white' : 'black')};
`;

export const Img = styled.View`
  background-color: transparent;
  width: 100%;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 12px;
`;

export const Conteiner = styled.View`
  width: 100%;

  align-items: ${(p) => (p.my ? 'flex-end' : 'flex-start')};
`;
