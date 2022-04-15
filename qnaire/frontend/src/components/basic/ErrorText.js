import * as React from "react";
import { Typography } from "@mui/material";

export default function ErrorText({ error }) {
  return error ? (
    <Typography color="error" textAlign="center">
      {error}
    </Typography>
  ) : null;
}
