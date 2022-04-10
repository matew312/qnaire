import React, { useEffect, useReducer, useState, useMemo } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import PreviewIcon from "@mui/icons-material/Preview";

import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { EditableText } from "./basic/EditableText";
import Section from "./Section";
import { useQnaireController } from "../controllers/useQnaireController";
import { useQnaireSelect } from "../providers/QnaireProvider";
import { getSelectedStyle } from "../style";
import { Resources } from "../data/Resources";
import HorizontalDragBox from "./basic/HorizontalDragBox";
import ErrorList from "./basic/ErrorList";

export function Questionnaire({ id }) {
  const { name, desc, sections, update, isLoaded, handleDragEnd, error } =
    useQnaireController(id);
  const { isSelected, select } = useQnaireSelect(id);

  if (!isLoaded) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="qnaire" type={Resources.SECTIONS}>
        {(provided) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            <Paper
              sx={{ backgroundColor: "background.default" }}
              variant="outlined"
            >
              <Grid
                container
                className="clickable"
                sx={{ /* borderBottom: 2, */ ...getSelectedStyle(isSelected) }}
                p={2}
                onClick={select}
              >
                <Grid item container xs={12} justifyContent="flex-end" alignItems="center">
                  <Grid item xs="auto">
                    <Tooltip title="Zobrazit náhled">
                      <IconButton>
                        <PreviewIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs="auto">
                    <Button  variant="contained">Publikovat</Button>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <EditableText
                    editable={isSelected}
                    typographyProps={{ variant: "h3" }}
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
                {error && (
                  <Grid item xs={12} mt={2}>
                    <ErrorList error={error} />
                  </Grid>
                )}
              </Grid>
            </Paper>
            <Grid container mt={1} spacing={4}>
              {sections.map((section, index) => (
                <Grid item xs={12} key={section.id}>
                  <Section id={section.id} index={index} />
                </Grid>
              ))}
            </Grid>
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}
