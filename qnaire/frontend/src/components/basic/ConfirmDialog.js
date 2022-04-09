import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ConfirmDialog({
  title,
  text,
  open,
  onClose,
  onConfirm,
}) {
  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        {title && <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>}
        {text && (
          <DialogContent>
            <DialogContentText id="confirm-dialog-description">
              {text}
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={onClose}>Zrušit</Button>
          <Button
            onClick={() => {
              //a confirm dialog should always close when confirmed, so I can put it here
              onClose();
              onConfirm();
            }}
            autoFocus
          >
            Potvrdit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
