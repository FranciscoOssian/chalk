import React, { useState, useEffect } from 'react';

import { Modal as Wrapper, Content } from './styles';

const Modal = ({ open, onClose, children, background }) => {
  const [state, setState] = useState(true);
  useEffect(() => {
    setState(open);
  }, [open]);
  return state ? <Wrapper background={background}>{children}</Wrapper> : null;
};

export default Modal;
