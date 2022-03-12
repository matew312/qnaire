import React, { useState } from "react";
import { Typography, TextField } from "@mui/material";

export function EditableText(props) {
  const [value, setValue] = useState(props.value);
  const [isFocused, setIsFocused] = useState(props.isFocused);

  return !isFocused ? (
    <Typography
      onClick={(e) => {
        setIsFocused(true);
      }}
      display="inline"
    >
      {value}
    </Typography>
  ) : (
    <TextField
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={(e) => setIsFocused(false)}
      variant="standard"
    />
  );
}

EditableText.defaultProps = {
  value: "",
  isFocused: false,
};
