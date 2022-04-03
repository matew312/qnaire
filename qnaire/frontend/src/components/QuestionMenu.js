import { ListItemIcon, MenuItem } from "@mui/material";
import React from "react";
import { OptionMenu } from "./basic/OptionMenu";
import Check from "@mui/icons-material/Check";
import { useQnaireContext } from "./QnaireContextProvider";
import { useQnaireSource } from "./QnaireSourceProvider";

export function MultipleChoiceQuestionMenu({id}) {
  const source = useQnaireSource();
  const { random_order } = source.getQuestion(id);

  return (
    <OptionMenu>
      <MenuItem
        onClick={() => source.updateQuestion(id, { random_order: !random_order })}
      >
        <ListItemIcon>{random_order && <Check />}</ListItemIcon>
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
