import React, { useState } from "react";
import { Radio, Checkbox } from "@mui/material";
import { EditableText } from "./basic/EditableText";

export function Choice(props) {
  return (
    <div>
      {props.checkbox ? (
        <Checkbox checked={false} />
      ) : (
        <Radio checked={false} />
      )}
      <EditableText {...props} />
    </div>
  );
}

Choice.defaultProps = {
  value: "",
  isFocused: true,
  checkbox: false,
};
