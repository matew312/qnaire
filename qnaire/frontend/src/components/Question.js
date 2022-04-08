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
import { useQuestionSelect } from "../providers/QnaireProvider";
import { getSelectedStyle } from "../style";
import ConfirmDialogIconButton from "./basic/ConfirmDialogIconButton";
import PasteButton from "./PasteButton";
import { QuestionTypes } from "../QuestionTypes";

function Question({
  options: QuestionOptions,
  menu: QuestionMenu,
  id,
  text,
  mandatory,
  order_num,
  resourcetype,
  error,
  update,
  destroy,
  ...data
}) {
  const { isSelected, select } = useQuestionSelect(id);

  return (
    <Card
      sx={getSelectedStyle(isSelected)}
      className="clickable"
      onClick={select}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <EditableText
              onChange={(text) => update({ text })}
              editable={isSelected}
              value={text}
              typographyProps={{ variant: "h4" }}
              textFieldProps={{
                fullWidth: true,
                id: "question-text",
                label: "Otázka",
                required: true,
              }}
            />
          </Grid>
          {isSelected && (
            <Grid item xs={12} sm={4}>
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
            </Grid>
          )}

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
                    <IconButton>
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
              {Object.keys(error).map((key) => {
                return (
                  <Typography key={key} color="error" textAlign="center">{`${key}: ${error[key]}`}</Typography>
                );
              })}
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default React.memo(Question);
