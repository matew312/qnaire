import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { useQnaireContext } from "../providers/QnaireProvider";

export default function PasteButton() {
  const { paste } = useQnaireContext();

  return (
    <Tooltip title="Vložit">
      <IconButton onClick={paste}>
        <ContentPasteIcon />
      </IconButton>
    </Tooltip>
  );
}
