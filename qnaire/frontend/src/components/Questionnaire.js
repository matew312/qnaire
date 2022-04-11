import React, { useEffect, useReducer, useState, useMemo, useRef } from "react";
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
import { useScrollWhenSelected } from "../hooks";
import PublishQnaireDialog from "./PublishQnaireDialog";

const Sections = React.memo(({ sections }) =>
  sections.map((section, index) => (
    <Grid item xs={12} key={section.id}>
      <Section id={section.id} index={index} />
    </Grid>
  ))
);

export function Questionnaire({ id }) {
  const {
    name,
    desc,
    private: isPrivate,
    anonymous: isAnonymous,
    published: isPublished,
    sections,
    update,
    publish,
    isLoaded,
    handleDragEnd,
    error,
  } = useQnaireController(id);
  const { isSelected, select } = useQnaireSelect(id);
  const scrollRef = useRef(null);
  useScrollWhenSelected(isSelected, scrollRef);

  useEffect(() => {
    if (isLoaded) {
      select();
    }
  }, [isLoaded]);

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
              ref={scrollRef}
            >
              <Grid
                container
                className="clickable"
                sx={{ /* borderBottom: 2, */ ...getSelectedStyle(isSelected) }}
                p={2}
                onClick={select}
              >
                <Grid
                  item
                  container
                  xs={12}
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Grid item xs="auto">
                    <Tooltip title="Zobrazit náhled">
                      <IconButton>
                        <PreviewIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs="auto">
                    <PublishQnaireDialog
                      name={name}
                      isPrivate={isPrivate}
                      isAnonymous={isAnonymous}
                      onPublish={publish}
                    />
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
              <Sections sections={sections} />
            </Grid>
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}
