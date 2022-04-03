import { TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EditableText } from "../basic/EditableText";
import { InputSlider } from "../basic/InputSlider";
import { NumField } from "../basic/NumField";
import { SmileyRating } from "../basic/SmileyRating";
import { Choice } from "../Choice";
import { QnaireContextProvider } from "../QnaireContextProvider";
import { QnaireSourceProvider } from "../QnaireSourceProvider";
import { Questionnaire } from "../Questionnaire";

export function CreationPage({ auth }) {
  let { id } = useParams();

  return (
    // <QnaireContextProvider id={id}>
    <QnaireSourceProvider id={id}>
      <Questionnaire />
    </QnaireSourceProvider>

    //   {/* <br /> <br /> <hr />
    //   <Typography variant="h2">Creation page</Typography>
    //   <EditableText value="This text is editable" />
    //   <Choice value="This is an editable choice" />
    //   <Choice value="This is an editable choice" checkbox={true} />
    //   <Typography variant="h3">Potential range question display:</Typography>
    //   <SmileyRating />
    //   <InputSlider />
    //   <InputSlider step={0.1} max={1.1} />
    //   <InputSlider step={null} max={10} />
    //   <NumField /> */}
    // </QnaireContextProvider>
  );
}
