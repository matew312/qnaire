import React, { useState } from "react";
import { Box, Divider, Grid, Tooltip, IconButton, Button } from "@mui/material";
import ConfirmDialogIconButton from "./basic/ConfirmDialogIconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { OptionMenu } from "./basic/OptionMenu";
import { EditableText } from "./basic/EditableText";
import Question from "./Question";
import { useSectionController } from "../controllers/useSectionController";
import { useSectionSelect } from "../providers/QnaireProvider";
import { getSelectedStyle } from "../style";
import PasteButton from "./PasteButton";
import { QuestionTypes } from "../QuestionTypes";
import HorizontalDragBox from "./basic/HorizontalDragBox";
import { Resources } from "../data/Resources";
import CollapseButton from "./basic/CollapseButton";

function Section({ id, index }) {
  const { name, desc, order_num, questions, update, destroy } =
    useSectionController(id);
  const { isSelected, select } = useSectionSelect(id);
  const [showQuestions, setShowQuestions] = useState(true);
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
    <Draggable draggableId={id.toString()} index={index}>
      {(draggableProvided) => (
        <Box
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          // sx={{
          //   backgroundColor: (theme) =>
          //     theme.palette.background.default,
          // }}
        >
          <Droppable droppableId={id.toString()} type={Resources.QUESTIONS}>
            {({ innerRef, droppableProps, placeholder }) => (
              <Box ref={innerRef} {...droppableProps}>
                <HorizontalDragBox
                  sx={getSelectedStyle(isSelected)}
                  px={2}
                  pb={2}
                  className="clickable"
                  onClick={select}
                  dragHandleProps={draggableProvided.dragHandleProps}
                >
                  <Grid container>
                    {isSelected && (
                      <Grid item xs={12} container justifyContent="flex-end">
                        <Grid item xs="auto">
                          <CollapseButton
                            collapsed={!showQuestions}
                            onClick={() =>
                              setShowQuestions(
                                (showQuestions) => !showQuestions
                              )
                            }
                          ></CollapseButton>
                        </Grid>
                      </Grid>
                    )}
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

                    {isSelected && (
                      <Grid
                        item
                        container
                        xs={12}
                        justifyContent="flex-end"
                        sx={{ pt: 1 }}
                      >
                        <Grid item xs="auto">
                          <ConfirmDialogIconButton
                            icon={DeleteIcon}
                            title={"Smazat sekci a všechny otázky v ní?"}
                            onConfirm={destroy}
                            tooltip={"Smazat"}
                          />
                        </Grid>
                        <Grid item xs="auto">
                          <PasteButton />
                        </Grid>
                        {/* <Grid item xs="auto">
                <OptionMenu></OptionMenu>
              </Grid> */}
                      </Grid>
                    )}
                  </Grid>
                </HorizontalDragBox>
                <Box
                  sx={{ ...style, display: showQuestions ? "block" : "none" }}
                >
                  <Grid container spacing={2}>
                    {questions.map((q, index) => {
                      const Question = QuestionTypes[q.resourcetype].component;
                      return (
                        <Grid item xs={12} key={q.id}>
                          <Question id={q.id} index={index} />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
                {placeholder}
              </Box>
            )}
          </Droppable>
        </Box>
      )}
    </Draggable>
  );
}

export default React.memo(Section);
