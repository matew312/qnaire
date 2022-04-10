import React, { useState } from "react";
import { Typography, TextField } from "@mui/material";

export function EditableText(props) {
  return !props.editable ? (
    <Typography {...props.typographyProps} sx={{ whiteSpace: "pre-wrap" }}>
      {props.value}
    </Typography>
  ) : (
    <TextField
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      {...props.textFieldProps}
      onFocus={(e) => {
        if (props.selectOnFocus) {
          e.target.select();
        }
      }}
    />
  );
}

EditableText.defaultProps = {
  value: "",
  editable: false,
  textFieldProps: {},
};
