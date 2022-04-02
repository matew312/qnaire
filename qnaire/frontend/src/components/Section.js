import { Box, Grid, Typography } from "@mui/material";
import React, { useContext, useMemo, useState } from "react";
import { EditableText } from "./basic/EditableText";
import { Question } from "./Question";
import { ActionTypes } from "../reducers";
import { sortArrayByOrderNum } from "../qnaireUtils";
import { useQnaireContext } from "./QnaireContextProvider";

export function Section({ id, name, desc, order_num }) {
  const {
    selected,
    questions: allQuestions,
    select,
    updateSection,
  } = useQnaireContext();
  const isSelected = Boolean(selected && selected.isEqual(Section, id));

  const questions = useMemo(
    () =>
      Object.keys(allQuestions).reduce((filtered, qId) => {
        if (allQuestions[qId].section === id) {
          filtered.push(allQuestions[qId]);
        }
        return filtered;
      }, []),
    [allQuestions]
  );

  const style = {
    display: "flex",
  };
  if (isSelected) {
    Object.assign(style, {
      borderTop: 1,
      borderLeft: 1,
      pl: 2,
      pt: 2,
      borderColor: "primary.light",
    });
  }

  return (
    <Grid container spacing={1}>
      <Grid
        item
        xs={12}
        container
        spacing={1}
        className="clickable"
        onClick={() => select(Section, id)}
      >
        <Grid item xs={12}>
          <EditableText
            editable={isSelected}
            value={name}
            onChange={(name) => {
              updateSection(id, { name });
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
        <Grid item xs={12}>
          <EditableText
            editable={isSelected}
            value={desc}
            onChange={(desc) => {
              updateSection(id, { desc });
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
      </Grid>
      <Grid item xs={12}>
        <Box sx={style}>
          <Grid container spacing={2}>
            {sortArrayByOrderNum(questions).map((q) => (
              <Grid item xs={12} key={q.id}>
                <Question data={q} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
