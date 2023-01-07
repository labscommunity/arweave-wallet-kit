import { useState } from "react";

export default function useModal(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen);

  return {
    setOpen,
    open,
    bindings: {
      open,
      onClose: () => setOpen(false)
    }
  };
}
