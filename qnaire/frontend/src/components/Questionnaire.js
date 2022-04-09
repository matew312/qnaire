import React, { useEffect, useReducer, useState, useMemo } from "react";
import { Grid, Typography } from "@mui/material";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { EditableText } from "./basic/EditableText";
import Section from "./Section";
import { useQnaireController } from "../controllers/useQnaireController";
import { useQnaireSelect } from "../providers/QnaireProvider";
import { getSelectedStyle } from "../style";
import { Resources } from "../data/Resources";
import HorizontalDragBox from "./basic/HorizontalDragBox";

export function Questionnaire({ id }) {
  const { name, desc, sections, update, isLoaded, handleDragEnd } =
    useQnaireController(id);
  const { isSelected, select } = useQnaireSelect(id);

  if (!isLoaded) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="qnaire" type={Resources.SECTIONS}>
        {(provided) => (
          <Grid container {...provided.droppableProps} ref={provided.innerRef}>
            <Grid
              item
              xs={12}
              container
              className="clickable"
              sx={{ borderBottom: 2, ...getSelectedStyle(isSelected) }}
              p={2}
              onClick={select}
            >
              <Grid item xs={12}>
                <EditableText
                  editable={isSelected}
                  typographyProps={{ variant: "h2" }}
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
            </Grid>
            <Grid item container xs={12} mt={1} spacing={4}>
              {sections.map((section, index) => (
                <Grid item xs={12} key={section.id}>
                  <Section id={section.id} index={index} />
                </Grid>
              ))}
            </Grid>
            {provided.placeholder}
          </Grid>
        )}
      </Droppable>
    </DragDropContext>
  );
}
