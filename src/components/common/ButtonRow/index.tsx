import { useState, ReactNode } from 'react';

import Accordion from '../Accordion';
import { Button, Title } from './styles';
import SVG from './svg';

interface Props {
  hidden?: boolean
  onPress?: () => void
  title?: string
  mode?: {
    type: string
    height: number
  }
  children?: ReactNode
}

const B = ({ onPress, title, mode, children, hidden }: Props) => {
  const [open, setOpen] = useState(false);

  const resizeMode = mode?.type === 'accordion';

  if(hidden) return null;

  return (
    <>
      <Button onPress={resizeMode ? () => setOpen((p) => !p) : onPress}>
        <Title>{title}</Title>
        <SVG />
      </Button>
      {resizeMode &&
        <Accordion height={mode.height} open={open}>
          {children}
        </Accordion>
      }
    </>
  );
};

export default B;
