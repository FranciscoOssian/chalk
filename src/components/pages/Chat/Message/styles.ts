import styled from 'styled-components/native';

type My = boolean;
type Type = 'image' | 'text';
type Theme = any;

export const Message = styled.View<{
  my: My;
  type: Type;
  theme: Theme;
  nextIsAnother: boolean;
  backIsAnother: boolean;
}>`
  background-color: ${(p) => (p.my ? p.theme.colors.primary : 'rgba(0, 0, 0, 0.06)')};

  border: 1px solid ${(p) => (p.my ? p.theme.colors.primary : 'rgba(0, 0, 0, 0)')};

  min-width: 50%;
  max-width: 90%;
  width: auto;

  height: auto;

  margin: 5px;

  margin-top: ${(p) => (p.nextIsAnother ? 10 : 0)}px;
  margin-bottom: ${(p) => (p.backIsAnother ? 10 : 0)}px;

  padding: ${(p) => (p.type === 'image' ? 0 : 10)}px;

  border-top-left-radius: ${(p) => (p.nextIsAnother ? 14 : 0)}px;
  border-top-right-radius: ${(p) => (p.nextIsAnother ? 14 : 0)}px;

  border-bottom-left-radius: ${(p) => (p.backIsAnother ? (p.my ? 14 : 0) : 0)}px;
  border-bottom-right-radius: ${(p) => (p.backIsAnother ? (p.my ? 0 : 14) : 0)}px;

  justify-content: center;
  align-items: flex-start;
`;

export const Txt = styled.Text<{ my: My }>`
  font-style: normal;
  font-weight: 400;
  font-size: 15px;

  flex-direction: row;

  color: ${(p) => (p.my ? 'white' : 'black')};
`;

export const Img = styled.View`
  background-color: transparent;
  width: 50%;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 12px;
`;

export const Conteiner = styled.View<{ my: My }>`
  width: 100%;

  align-items: ${(p) => (p.my ? 'flex-end' : 'flex-start')};
`;
