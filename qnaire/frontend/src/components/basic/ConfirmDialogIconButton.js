import { IconButton, Tooltip } from "@mui/material";
import * as React from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function ConfirmDialogIconButton({
  icon: Icon,
  tooltip,
  title,
  text,
  onConfirm,
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title={tooltip}>
        <IconButton onClick={handleClickOpen}>
          <Icon />
        </IconButton>
      </Tooltip>
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
