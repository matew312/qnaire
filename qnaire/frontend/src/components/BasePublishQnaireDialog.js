import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { Form, Formik, useFormik } from "formik";
import FSwitch from "./formik/FSwitch";

export default function BasePublishQnaireDialog({
  isAnonymous,
  isPrivate,
  onSubmit,
  title,
  buttonText,
  buttonProps,
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const initialValues = { isPrivate, isAnonymous };
  const submit = (values) => {
    onSubmit(values);
  };

  return (
    <React.Fragment>
      <Button {...buttonProps} onClick={handleClickOpen}>
        {buttonText}
      </Button>
      <Dialog fullWidth open={open} onClose={handleClose}>
        <Formik initialValues={initialValues} onSubmit={submit}>
          <Form>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
              {/* <DialogContentText>
          
        </DialogContentText> */}
              <FormGroup>
                <FSwitch name="isPrivate" label="Soukromý" />
                <FSwitch name="isAnonymous" label="Anonymní" />
              </FormGroup>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Zrušit</Button>
              <Button type="submit">{buttonText}</Button>
            </DialogActions>
          </Form>
        </Formik>
      </Dialog>
    </React.Fragment>
  );
}
