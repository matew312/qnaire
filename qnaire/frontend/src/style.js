import { Card } from "@mui/material";
import React from "react";

export function getSelectedStyle(isSelected) {
  const style = isSelected
    ? {
        border: 1,
        borderColor: "primary.light",
      }
    : {};
  return style;
}
