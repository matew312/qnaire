import { TextField } from "@mui/material";
import * as React from "react";

//required prop: name
export default function ETextField({ error, ...props }) {
  return (
    <TextField {...props} error={Boolean(error)} helperText={error} />
  );
}
