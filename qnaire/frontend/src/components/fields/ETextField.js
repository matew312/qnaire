import { TextField } from "@mui/material";
import * as React from "react";

//required prop: name
export default function ETextField({ error, ...props }) {
  return (
    <TextField {...props} fullWidth error={Boolean(error)} helperText={error} />
  );
}
