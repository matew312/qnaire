import { Grid, Typography } from "@mui/material";
import React, { useEffect, useReducer, useState } from "react";
import { EditableText } from "./basic/EditableText";
import { Section } from "./Section";
import { dictToArraySortedByOrderNum } from "../qnaireUtils";
import { GET } from "../request";
import { useQnaireContext } from "./QnaireContextProvider";

export function Questionnaire() {
  const { id, name, desc, sections, selected, select, updateQnaire } =
    useQnaireContext();
  const isSelected = Boolean(selected && selected.isEqual(Questionnaire, id));

  return name !== undefined ? (
    <Grid container spacing={4}>
      <Grid
        item
        xs={12}
        container
        spacing={1}
        className="clickable"
        onClick={() => select(Questionnaire, id)}
      >
        <Grid item xs={12}>
          <EditableText
            editable={isSelected}
            typographyProps={{ variant: "h2" }}
            value={name}
            onChange={(name) => {
              updateQnaire({ name });
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
              updateQnaire({ desc });
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
      <Grid item container xs={12} spacing={4}>
        {dictToArraySortedByOrderNum(sections).map((section) => (
          <Grid item xs={12} key={section.id}>
            <Section {...section} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  ) : null;
}
