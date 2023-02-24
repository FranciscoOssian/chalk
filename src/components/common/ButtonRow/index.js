import { useState } from 'react';

import Accordion from '../Accordion';
import { Button, Title, Wrapper } from './styles';
import SVG from './svg';

const B = ({ onPress, title, mode, children }) => {
  const [open, setOpen] = useState(false);

  const resizeMode = mode?.type === 'accordion';

  return (
    <>
      <Button onPress={resizeMode ? () => setOpen((p) => !p) : onPress}>
        <Title>{title}</Title>
        <SVG />
      </Button>
      {resizeMode ? (
        <Accordion height={mode.height} open={open}>
          {children}
        </Accordion>
      ) : null}
    </>
  );
};

export default B;
