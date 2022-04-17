import * as React from "react";
import { Typography } from "@mui/material";

export default function ErrorText({ error, ...props }) {
  return error ? (
    <Typography color="error" textAlign="center" {...props}>
      {error}
    </Typography>
  ) : null;
}
