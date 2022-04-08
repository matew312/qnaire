import { Button } from "@mui/material";
import * as React from "react"
import ConfirmDialog from "./ConfirmDialog";

export default function ConfirmDialogButton({ buttonText, title, text, onConfirm }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        {buttonText}
      </Button>
      <ConfirmDialog
        onClose={handleClose}
        open={open}
        onConfirm={onConfirm}
        text={text}
        title={title}
      />
    </div>
  );
}
