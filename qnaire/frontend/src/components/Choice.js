import React, { useContext, useState } from "react";
import {
  Grid,
  IconButton,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { EditableText } from "./basic/EditableText";
import { ChoiceIcon } from "./basic/ChoiceIcon";
import ClearIcon from "@mui/icons-material/Clear";
import { useQnaireContext } from "./QnaireContextProvider";

export function Choice({
  data,
  id,
  text,
  skip_to_section,
  editable,
  textFieldProps,
}) {
  const { sections, updateQuestionChoice } = useQnaireContext();
  console.log(sections);

  return (
    <Grid container alignItems="center">
      <Grid item xs="auto">
        <ChoiceIcon checkbox={data.max_answers > 1} />
      </Grid>
      <Grid item xs>
        <EditableText
          value={text}
          editable={editable}
          onChange={(text) => updateQuestionChoice(data.id, id, { text })}
          textFieldProps={{ ...textFieldProps }}
        />
      </Grid>
      {editable && (
        <Grid item xs={3}>
          <FormControl fullWidth size="small" variant="filled">
            <InputLabel id="skip-to-section-label">Přeskočit na</InputLabel>
            <Select
              label="Přeskočit na"
              id="skip-to-section-select"
              labelId="skip-to-section-label"
              defaultValue={skip_to_section ? skip_to_section.id.toString() : ""}
            >
              {Object.keys(sections).map((id) => (
                <MenuItem value={id} key={id}>
                  {sections[id].name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
      {editable && (
        <Grid item xs="auto">
          <IconButton>
            <ClearIcon />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
}

Choice.defaultProps = {
  value: "",
  editable: true,
  checkbox: false,
  textFieldProps: {
    variant: "filled",
    size: "small",
    fullWidth: true,
    required: true,
  },
};
