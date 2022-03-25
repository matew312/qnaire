import { ListItemIcon, MenuItem } from "@mui/material";
import React from "react";
import { OptionMenu } from "./basic/OptionMenu";
import Check from "@mui/icons-material/Check";

export function MultipleChoiceQuestionMenu(props) {
  const data = props.data;

  return (
    <OptionMenu>
      <MenuItem>
        {props.data.random_order && (
          <ListItemIcon>
            <Check />
          </ListItemIcon>
        )}
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
