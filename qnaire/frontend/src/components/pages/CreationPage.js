import { TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EditableText } from "../basic/EditableText";
import { InputSlider } from "../basic/InputSlider";
import { NumField } from "../basic/NumField";
import { SmileyRating } from "../basic/SmileyRating";
import { Choice } from "../Choice";
import { MultipleChoiceQuestionOptions } from "../MultipleChoiceQuestionOptions";
import { Question } from "../Question";
import { Questionnaire } from "../Questionnaire";

export function CreationPage({ auth }) {

  const [data, setData] = useState(null);
  const [v, setV] = useState("");

  let { id } = useParams();

  return (
    <div>
      <Questionnaire id={id} />
      <br /> <br /> <hr />
      <Typography variant="h2">Creation page</Typography>
      <EditableText value="This text is editable" />
      <Choice value="This is an editable choice" />
      <Choice value="This is an editable choice" checkbox={true} />
      <Typography variant="h3">Potential range question display:</Typography>
      <SmileyRating />
      <InputSlider />
      <InputSlider step={0.1} max={1.1} />
      <InputSlider step={null} max={10} />
      <NumField />
      {/* <Question text="Jak se mas?" />
      <Question text="Hej hej?" selected={true} type="OpenQuestion" /> */}
      {/* <Question text="Hej hej?" selected={false} type="OpenQuestion" /> */}
    </div>
  );
}
