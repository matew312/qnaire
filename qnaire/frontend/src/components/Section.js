import { Box, Grid, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { SelectableType } from "../SelectableType";
import { EditableText } from "./basic/EditableText";
import { Question } from "./Question";
import { ActionTypes } from "../reducers";
import { sortArrayByOrderNum } from "../qnaireUtils";

export function Section({ data, selected, dispatch, questions }) {
  const isSelected = Boolean(
    selected &&
      selected.type === SelectableType.SECTION &&
      selected.id === data.id
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
      <Grid item xs={12}>
        <div
          onClick={() =>
            dispatch({
              type: ActionTypes.SELECT,
              data: { type: SelectableType.SECTION, id: data.id },
            })
          }
        >
          <EditableText
            editable={isSelected}
            value={data.name}
            typographyProps={{ variant: "h3" }}
            textFieldProps={{
              fullWidth: true,
              id: "section-text",
              label: "Sekce",
              required: true,
            }}
          />
        </div>
      </Grid>
      <Grid item xs={12}>
        <Box sx={style}>
          <Grid container spacing={2}>
            {sortArrayByOrderNum(questions).map((q) => (
              <Grid item xs={12} key={q.id}>
                <Question data={q} selected={selected} dispatch={dispatch} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
