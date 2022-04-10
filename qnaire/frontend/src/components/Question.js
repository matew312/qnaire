import {
  Grid,
  Select,
  MenuItem,
  Switch,
  FormGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Divider,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import * as React from "react";
import { EditableText } from "./basic/EditableText";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Draggable } from "react-beautiful-dnd";
import {
  useQnaireContext,
  useQuestionSelect,
} from "../providers/QnaireProvider";
import { getSelectedStyle } from "../style";
import ConfirmDialogIconButton from "./basic/ConfirmDialogIconButton";
import PasteButton from "./PasteButton";
import { QuestionTypes } from "../QuestionTypes";
import HorizontalDragBox from "./basic/HorizontalDragBox";
import ErrorList from "./basic/ErrorList";

function Question({
  options: QuestionOptions,
  menu: QuestionMenu,
  index,
  id,
  text,
  mandatory,
  //order_num,
  resourcetype,
  error,
  update,
  destroy,
  ...data
}) {
  const { isSelected, select } = useQuestionSelect(id);
  const { copy } = useQnaireContext();

  return (
    <Draggable draggableId={id.toString()} index={index}>
      {(provided) => (
        <Card
          sx={{ px: 2, pb: 2, ...getSelectedStyle(isSelected) }}
          // raised
          className="clickable"
          onClick={select}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <HorizontalDragBox dragHandleProps={provided.dragHandleProps}>
            {/* <CardContent> */}
            <Grid container spacing={2} alignItems="top">
              <Grid item xs /* xs={12} sm={8} */>
                <EditableText
                  onChange={(text) => update({ text })}
                  editable={isSelected}
                  value={text}
                  selectOnFocus={true}
                  typographyProps={{ variant: "h5" }}
                  textFieldProps={{
                    fullWidth: true,
                    id: "question-text",
                    label: "Otázka",
                    required: true,
                  }}
                />
              </Grid>
              <Grid item /* sm="auto" */ xs={12} sm={4}>
                {isSelected ? (
                  <FormControl fullWidth required>
                    <InputLabel id="type-select-label">Typ otázky</InputLabel>
                    <Select
                      value={resourcetype}
                      label="Typ otázky"
                      onChange={(e) => update({ resourcetype: e.target.value })}
                      id="type-select"
                      labelId="type-select-label"
                    >
                      {Object.keys(QuestionTypes).map((type) => (
                        <MenuItem value={type} key={type}>
                          {QuestionTypes[type].desc}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Typography color="text.secondary" textAlign="right">
                    {QuestionTypes[resourcetype].desc}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <QuestionOptions
                  id={id}
                  {...data}
                  update={update}
                  isSelected={isSelected}
                />
              </Grid>

              {isSelected && (
                <Grid item container xs={12}>
                  <Grid item xs={12}>
                    <Divider light />
                  </Grid>
                  <Grid
                    item
                    container
                    xs={12}
                    justifyContent="flex-end"
                    sx={{ pt: 1 }}
                  >
                    <Grid item xs="auto">
                      <Tooltip title="Zkopírovat">
                        <IconButton onClick={copy}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    {/* <Grid item xs="auto">
                    <Tooltip title="Vyjmout">
                      <IconButton>
                        <ContentCutIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid> */}
                    <Grid item xs="auto">
                      <ConfirmDialogIconButton
                        icon={DeleteIcon}
                        title={"Smazat otázku?"}
                        onConfirm={destroy}
                        tooltip={"Smazat"}
                      />
                    </Grid>
                    <Grid item xs="auto">
                      <PasteButton />
                    </Grid>

                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                    <Grid item xs="auto">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={mandatory}
                              onChange={(e) =>
                                update({
                                  mandatory: e.target.checked,
                                })
                              }
                            />
                          }
                          label="Povinná"
                        />
                      </FormGroup>
                    </Grid>
                    <Grid item xs="auto">
                      <QuestionMenu id={id} {...data} update={update} />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {error && (
                <Grid item xs={12}>
                  <ErrorList error={error} />
                </Grid>
              )}
            </Grid>
            {/* </CardContent> */}
          </HorizontalDragBox>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(Question);
