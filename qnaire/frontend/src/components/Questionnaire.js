import { Grid, Typography } from "@mui/material";
import React, { useEffect, useReducer, useState, useMemo } from "react";
import { EditableText } from "./basic/EditableText";
import Section from "./Section";
import { Resources } from "../Resources";
import { useQnaireSource } from "./QnaireSourceProvider";
import { useForceRender } from "../hooks";

export function Questionnaire() {
  const source = useQnaireSource();
  const forceRender = useForceRender();

  useEffect(() => {
    source.subscribeQnaire(forceRender);

    return () => {
      source.unsubscribeQnaire(forceRender);
    };
  }, [source]);

  const { id, name, desc } = source.getQnaire();
  const sections = source.getSections();
  const isSelected = source.isSelected(Resources.QNAIRES, id);

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        container
        spacing={1}
        className="clickable"
        onClick={() => {
          source.select(Resources.QNAIRES, id, forceRender);
          forceRender();
        }}
      >
        <Grid item xs={12}>
          <EditableText
            editable={isSelected}
            typographyProps={{ variant: "h2" }}
            value={name}
            onChange={(name) => {
              source.updateQnaire({ name });
            }}
            textFieldProps={{
              fullWidth: true,
              label: "Dotazník",
              id: "questionnaire-name",
              required: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <EditableText
            editable={isSelected}
            value={desc}
            onChange={(desc) => {
              source.updateQnaire({ desc });
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
            <Section id={section.id} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
