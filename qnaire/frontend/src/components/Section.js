import { Box, Grid, Typography } from "@mui/material";
import React, { useMemo, useEffect } from "react";
import { EditableText } from "./basic/EditableText";
import Question from "./Question";
import { ActionTypes } from "../reducers";
import { sortArrayByOrderNum } from "../qnaireUtils";
import { useQnaireContext } from "./QnaireContextProvider";
import { Resources } from "../Resources";
import { useQnaireSource } from "./QnaireSourceProvider";
import { useForceRender } from "../hooks";

function Section({ id }) {
  const forceRender = useForceRender();
  const source = useQnaireSource();
  const { name, desc, order_num } = source.getSection(id);
  const isSelected = source.isSelected(Resources.SECTIONS, id);
  const questions = source.getQuestionsForSection(id);

  useEffect(() => {
    source.subscribeSection(id, forceRender);
    return () => {
      source.unsubscribeSection(id, forceRender);
    };
  }, []);

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
        onClick={() => {
          source.select(Resources.SECTIONS, id, forceRender);
          forceRender();
        }}
      >
        <Grid item xs={12}>
          <EditableText
            editable={isSelected}
            value={name}
            onChange={(name) => {
              source.updateSection(id, { name });
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
              source.updateSection(id, { desc });
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
            {questions.map((q) => (
              <Grid item xs={12} key={q.id}>
                <Question id={q.id} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

export default React.memo(Section);
