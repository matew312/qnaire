import { Grid, Typography } from "@mui/material";
import React, { useEffect, useReducer, useState, useMemo } from "react";
import { EditableText } from "./basic/EditableText";
import Section from "./Section";
import { useQnaireController } from "../controllers/useQnaireController";
import { useQnaireSelect } from "../providers/QnaireProvider";
import { getSelectedStyle } from "../style";

export function Questionnaire({ id }) {
  const { name, desc, sections, update, isLoaded } = useQnaireController(id);
  const { isSelected, select } = useQnaireSelect(id);

  if (!isLoaded) {
    return null;
  }

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        container
        className="clickable"
        sx={getSelectedStyle(isSelected)}
        p={2}
        onClick={select}
      >
        <Grid item xs={12}>
          <EditableText
            editable={isSelected}
            typographyProps={{ variant: "h2" }}
            value={name}
            onChange={(name) => {
              update({ name });
            }}
            textFieldProps={{
              fullWidth: true,
              label: "Dotazník",
              id: "questionnaire-name",
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
              label: "Popis",
              id: "questionnaire-desc",
              multiline: true,
              minRows: 3,
            }}
          />
        </Grid>
      </Grid>
      <Grid item container xs={12} mt={4} spacing={4}>
        {sections.map((section) => (
          <Grid item xs={12} key={section.id}>
            <Section id={section.id} /> {/* Pass just the id */}
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
