import * as React from "react";
import { Box, Divider, Grid, Tooltip, IconButton } from "@mui/material";
import ConfirmDialogIconButton from "./basic/ConfirmDialogIconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { OptionMenu } from "./basic/OptionMenu";
import { EditableText } from "./basic/EditableText";
import Question from "./Question";
import { useSectionController } from "../controllers/useSectionController";
import { useSectionSelect } from "../providers/QnaireProvider";
import { getSelectedStyle } from "../style";
import PasteButton from "./PasteButton";
import { QuestionTypes } from "../QuestionTypes";

function Section({ id }) {
  const { name, desc, order_num, questions, update, destroy } =
    useSectionController(id);
  const { isSelected, select } = useSectionSelect(id);
  const style = {
    display: "flex",
  };
  if (isSelected) {
    Object.assign(style, {
      borderLeft: 2,
      pl: 2,
      pt: 2,
      borderColor: "primary.light", //"secondary.light",
    });
  }

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        container
        sx={getSelectedStyle(isSelected)}
        p={2}
        className="clickable"
        onClick={select}
      >
        <Grid item xs={12}>
          <EditableText
            editable={isSelected}
            value={name}
            onChange={(name) => {
              update({ name });
            }}
            typographyProps={{ variant: "h3" }}
            textFieldProps={{
              fullWidth: true,
              id: "section-name",
              label: "Sekce",
              required: true,
            }}
          />
        </Grid>
        <Grid item xs={12} mt={2}>
          <EditableText
            editable={isSelected}
            value={desc}
            onChange={(desc) => {
              update({ desc });
            }}
            textFieldProps={{
              fullWidth: true,
              id: "section-desc",
              label: "Popis",
              multiline: true,
              minRows: 2,
            }}
          />
        </Grid>

        {isSelected && (
          <Grid item container xs={12} justifyContent="flex-end" sx={{ pt: 1 }}>
            <Grid item xs="auto">
              <ConfirmDialogIconButton
                icon={DeleteIcon}
                title={"Smazat sekci a všechny otázky v ní?"}
                onConfirm={destroy}
                tooltip={"Smazat"}
              />
            </Grid>
            <Grid item xs="auto">
              <PasteButton />
            </Grid>
            {/* <Grid item xs="auto">
                <OptionMenu></OptionMenu>
              </Grid> */}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Box sx={style}>
          <Grid container spacing={2}>
            {questions.map((q) => {
              const Question = QuestionTypes[q.resourcetype].component;
              return (
                <Grid item xs={12} key={q.id}>
                  <Question id={q.id} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

export default React.memo(Section);
