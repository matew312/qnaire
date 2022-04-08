import { Box, Grid, Typography } from "@mui/material";
import React, { useMemo, useEffect } from "react";
import { EditableText } from "./basic/EditableText";
import Question from "./Question";
import { useSectionController } from "../controllers/useSectionController";
import { useSectionSelect } from "../providers/QnaireProvider";
import { getSelectedStyle } from "../style";

function Section({ id }) {
  const { name, desc, order_num, questionIds, update } =
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
      </Grid>
      <Grid item xs={12}>
        <Box sx={style}>
          <Grid container spacing={2}>
            {questionIds.map((qId) => (
              <Grid item xs={12} key={qId}>
                <Question id={qId} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

export default React.memo(Section);
