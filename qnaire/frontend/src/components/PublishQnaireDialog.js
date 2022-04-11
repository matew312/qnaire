import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { useFormik } from "formik";
import FSwitch from "./formik/FSwitch";

export default function PublishQnaireDialog({
  name,
  isAnonymous,
  isPrivate,
  onPublish,
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submit = (values) => {
    console.log("submitted");
    onPublish(values);
  };

  const formik = useFormik({
    initialValues: { isPrivate, isAnonymous },
    // validationSchema: validationSchema,
    onSubmit: submit,
  });

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen}>
        Publikovat
      </Button>
      <Dialog fullWidth open={open} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Publikovat dotazník "{name}"</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
          
        </DialogContentText> */}
            <FormGroup>
              <FSwitch id="isPrivate" label="Soukromý" formik={formik} />
              <FSwitch id="isAnonymous" label="Anonymní" formik={formik} />
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Zrušit</Button>
            <Button type="submit">Publikovat</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
