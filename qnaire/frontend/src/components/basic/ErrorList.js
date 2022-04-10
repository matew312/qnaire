import * as React from "react";
import { Typography } from "@mui/material";

export default function ErrorList({ error }) {
  return Object.keys(error).map((key) => {
    return (
      <Typography
        key={key}
        color="error"
        textAlign="center"
      >{`${key}: ${error[key]}`}</Typography>
    );
  });
}
