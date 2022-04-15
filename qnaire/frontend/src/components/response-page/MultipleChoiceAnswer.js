import {
  Checkbox,
  FormControl,
  FormControlLabel,
  RadioGroup,
  TextField,
  Radio,
  Stack,
  FormGroup,
} from "@mui/material";
import * as React from "react";
import useMultipleChoiceAnswerController from "../../controllers/useMultipleChoiceAnswerController";
import ErrorText from "../basic/ErrorText";
import Answer from "./Answer";

function Checkboxes({
  answer,
  choices,
  question,
  addChoice,
  removeChoice,
  addOtherChoice,
  removeOtherChoice,
}) {
  const [otherChoiceSelected, setOtherChoiceSelected] = React.useState(false);

  const handleChange = (e, choice) => {
      e.target.checked ? addChoice(choice.id) : removeChoice(choice.id);
  };

  const handleOtherChoiceChange = (e) => {
    const checked = e.target.checked;
    if (!checked) {
      removeOtherChoice();
    }
    setOtherChoiceSelected(checked);
  };

  const handleOtherChoiceInputChange = (e) => {
    addOtherChoice(e.target.value);
  };

  return (
    <FormGroup>
      {choices.map((choice) => (
        <FormControlLabel
          key={choice.id}
          control={
            <Checkbox
              checked={Boolean(
                answer.choices && answer.choices.includes(choice.id)
              )}
              onChange={(e) => handleChange(e, choice)}
            />
          }
          label={choice.text}
        />
      ))}
      {question.other_choice && (
        <Stack direction="row" alignItems="center">
          <FormControlLabel
            key="other_choice"
            control={
              <Checkbox
                checked={otherChoiceSelected}
                onChange={handleOtherChoiceChange}
              />
            }
            label="Jiná odpověď:"
          />
          <TextField
            value={answer.other_choice_text}
            onChange={handleOtherChoiceInputChange}
            disabled={!otherChoiceSelected}
            variant="standard"
          />
        </Stack>
      )}
    </FormGroup>
  );
}

function RadioButtons({
  choices,
  setChoice,
  setSkipToSectionId,
  answer,
  question: { other_choice },
}) {
  const [otherChoiceSelected, setOtherChoiceSelected] = React.useState(false);
  let value = "";
  if (answer.choices !== null) {
    value = answer.choices[0];
  } else if (otherChoiceSelected) {
    value = "other_choice";
  }

  const handleChange = (e) => {
    const value = e.target.value;
    if (value !== "other_choice") {
      setChoice(parseInt(value), false);
      setOtherChoiceSelected(false);
    } else {
      setOtherChoiceSelected(true);
      setChoice("", true); //alternatively call "removeChoice" on current answer if any
    }
  };

  const handleOtherChoiceInputChange = (e) => {
    setChoice(e.target.value, true);
  };

  return (
    <FormControl>
      <RadioGroup value={value} onChange={handleChange}>
        {choices.map((choice) => (
          <FormControlLabel
            key={choice.id}
            value={choice.id.toString()}
            control={<Radio />}
            label={choice.text}
          />
        ))}
        {other_choice && (
          <Stack direction="row" alignItems="center">
            <FormControlLabel
              key="other_choice"
              value="other_choice"
              control={<Radio />}
              label={"Jiná odpověď:"}
            />
            <TextField
              value={answer.other_choice_text}
              onChange={handleOtherChoiceInputChange}
              disabled={!otherChoiceSelected}
              variant="standard"
            />
          </Stack>
        )}
      </RadioGroup>
    </FormControl>
  );
}

function MultipleChoiceAnswer(props) {
  const {
    question,
    choices,
    addChoice,
    addOtherChoice,
    removeChoice,
    removeOtherChoice,
    setChoice,
    answer,
    error,
    setSkipToSectionId,
  } = useMultipleChoiceAnswerController(props);

  const Component = question.max_answers === 1 ? RadioButtons : Checkboxes;

  return (
    <Answer question={question} shouldScroll={props.shouldScroll}>
      <Component
        question={question}
        choices={choices}
        addChoice={addChoice}
        addOtherChoice={addOtherChoice}
        removeChoice={removeChoice}
        removeOtherChoice={removeOtherChoice}
        setChoice={setChoice}
        answer={answer}
        setSkipToSectionId={setSkipToSectionId}
      />
      <ErrorText error={error} />
    </Answer>
  );
}

export default React.memo(MultipleChoiceAnswer);
