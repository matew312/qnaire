import React, { useState } from "react";
import { Typography, TextField } from "@mui/material";

export function EditableText(props) {
  return !props.editable ? (
    <Typography {...props.typographyProps}>{props.value}</Typography>
  ) : (
    <TextField
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      {...props.textFieldProps}
    />
  );
}

EditableText.defaultProps = {
  value: "",
  editable: false,
  textFieldProps: {},
  typographyProps: {},
};
