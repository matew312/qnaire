import { Box, Grid, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { SelectableType } from "../SelectableType";
import { EditableText } from "./basic/EditableText";
import { Question } from "./Question";
import { ActionTypes } from "../reducers";
import { sortArrayByOrderNum } from "../qnaireUtils";

export function Section({ data, selected, dispatch, questions }) {
  const { id, name, desc, order_num } = data;
  const isSelected = Boolean(
    selected &&
      selected.type === SelectableType.SECTION &&
      selected.id === id
  );

  function dispatchSectionUpdate(updatedData) {
    dispatch({
      type: ActionTypes.UPDATE,
      resource: 'sections',
      id,
      data: updatedData,
    });
  }

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
        onClick={() =>
          dispatch({
            type: ActionTypes.SELECT,
            data: { type: SelectableType.SECTION, id },
          })
        }
      >
        <Grid item xs={12}>
          <EditableText
            editable={isSelected}
            value={name}
            onChange={(name) => {
              dispatchSectionUpdate({ name });
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
              dispatchSectionUpdate({ desc });
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
                <Question data={q} selected={selected} dispatch={dispatch} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
