import { useState } from 'react';

export function useAlert() {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(prev => !prev);
  };

  return {
    open,
    toggleOpen,
  };
}
