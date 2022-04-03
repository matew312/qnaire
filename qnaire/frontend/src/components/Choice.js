import React, { useEffect } from "react";
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
import { useQnaireSource } from "./QnaireSourceProvider";
import { useForceRender } from "../hooks";

export default function Choice({ id, editable, checkbox, textFieldProps }) {
  const forceRender = useForceRender();
  const source = useQnaireSource();
  const { text, skip_to_section } = source.getChoice(id);
  const sections = source.getSections();

  useEffect(() => {
    source.subscribeSections(forceRender);
    source.subscribeChoice(id, forceRender); //not really needed

    return () => {
      source.unsubscribeSections(forceRender);
      source.unsubscribeChoice(id, forceRender);
    };
  }, []);

  return (
    <Grid container alignItems="center">
      <Grid item xs="auto">
        <ChoiceIcon checkbox={checkbox} />
      </Grid>
      <Grid item xs>
        <EditableText
          value={text}
          editable={editable}
          onChange={(text) => source.updateChoice(id, { text })}
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
              defaultValue={
                skip_to_section ? skip_to_section.id.toString() : ""
              }
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
