import { ListItemIcon, MenuItem } from "@mui/material";
import React from "react";
import { OptionMenu } from "./basic/OptionMenu";
import Check from "@mui/icons-material/Check";

export function MultipleChoiceQuestionMenu({ data, updateQuestion }) {
  return (
    <OptionMenu>
      <MenuItem
        onClick={() => updateQuestion({ random_order: !data.random_order })}
      >
        <ListItemIcon>{data.random_order && <Check />}</ListItemIcon>
        Zobrazovat možnosti v náhodném pořadí
      </MenuItem>
    </OptionMenu>
  );
}

export function OpenQuestionMenu(props) {
  return <OptionMenu></OptionMenu>;
}

export function RangeQuestionMenu(props) {
  return <OptionMenu></OptionMenu>;
}
