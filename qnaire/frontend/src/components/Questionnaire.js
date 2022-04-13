import React, { useEffect, useReducer, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
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
import DeleteIcon from "@mui/icons-material/Delete";
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
import ConfirmDialogButton from "./basic/ConfirmDialogButton";
import ConfirmDialogIconButton from "./basic/ConfirmDialogIconButton";
import UnpublishDialogButton from "./UnpublishDialogButton";

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
    destroy,
    publish,
    isLoaded,
    handleDragEnd,
    error,
    previewLink,
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
                  spacing={1}
                >
                  <Grid item xs="auto">
                    <Tooltip title="Zobrazit náhled">
                      <Link
                        to={previewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconButton>
                          <PreviewIcon fontSize="large" />
                        </IconButton>
                      </Link>
                    </Tooltip>
                  </Grid>
                  <Grid item xs="auto">
                    {!isPublished ? (
                      <PublishQnaireDialog
                        name={name}
                        isPrivate={isPrivate}
                        isAnonymous={isAnonymous}
                        onPublish={publish}
                        buttonProps={{ variant: "contained" }}
                      />
                    ) : (
                      <UnpublishDialogButton
                        buttonProps={{
                          variant: "contained",
                        }}
                        onConfirm={() => update({ published: false })}
                      />
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <EditableText
                    editable={isSelected}
                    typographyProps={{ variant: "h3" }}
                    value={name}
                    error={error.name}
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
                    error={error.desc}
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
                <Grid item xs={12} container justifyContent="flex-end">
                  <Grid item xs="auto">
                    <ConfirmDialogIconButton
                      icon={DeleteIcon}
                      title={
                        isPublished
                          ? "Smazat dotazník a všechny dosud nasbírané odpovědi?"
                          : "Smazat dotazník?"
                      }
                      onConfirm={destroy}
                      tooltip={"Smazat"}
                    />
                  </Grid>
                </Grid>
                <ErrorList error={error} />
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
