import { Box } from "@mui/material";
import React, { useState } from "react";

export function QuestionnaireComponentBox(props) {
  function onTypeChange() {}

  const style = {
    bgcolor: "white",
    borderRadius: 2,
    display: "flex",
    px: 2,
    pt: 2,
  };
  if (props.selected) {
    Object.assign(style, {
      border: 1,
      borderColor: "primary.light",
    });
  }

  const data = props.data;
  const type = data.resourcetype;

  const Options = QUESTION_TYPES[type].component;

  return <Box sx={style}>{props.children}</Box>;
}
