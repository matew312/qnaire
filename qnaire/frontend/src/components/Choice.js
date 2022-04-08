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
import { useChoiceController } from "../controllers/useChoiceController";
import ScrollableSelect from "./basic/ScrollableSelect";

export default function Choice({ id, editable, checkbox, textFieldProps }) {
  const { text, skip_to_section, sections, update, destroy } =
    useChoiceController(id);

  return (
    <Grid container alignItems="center">
      <Grid item xs="auto">
        <ChoiceIcon checkbox={checkbox} />
      </Grid>
      <Grid item xs>
        <EditableText
          value={text}
          editable={editable}
          onChange={(text) => update({ text })}
          textFieldProps={{ ...textFieldProps }}
        />
      </Grid>
      {editable && (
        <Grid item xs={3}>
          <FormControl fullWidth size="small" variant="filled">
            <InputLabel id="skip-to-section-label">Přeskočit na</InputLabel>
            <ScrollableSelect
              label="Přeskočit na"
              id="skip-to-section-select"
              labelId="skip-to-section-label"
              value={skip_to_section ? skip_to_section.toString() : ""}
              onChange={(e) =>
                update({
                  skip_to_section: e.target.value
                    ? parseInt(e.target.value)
                    : null,
                })
              }
            >
              <MenuItem value="">&#8212;</MenuItem>
              {sections.map((section) => (
                <MenuItem value={section.id} key={section.id}>
                  {section.name}
                </MenuItem>
              ))}
            </ScrollableSelect>
          </FormControl>
        </Grid>
      )}
      {editable && (
        <Grid item xs="auto">
          <IconButton onClick={destroy}>
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
