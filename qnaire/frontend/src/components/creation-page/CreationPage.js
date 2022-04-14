import { Slider, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EditableText } from "../basic/EditableText";
import { InputSlider } from "../basic/InputSlider";
import { NumField } from "../basic/NumField";
import { SmileyRating } from "../basic/SmileyRating";
import { QnaireProvider } from "../../providers/QnaireProvider";
import { Questionnaire } from "./Questionnaire";
import { QnaireErrorDialog } from "../dialogs/QnaireErrorDialog";

export function CreationPage({ auth }) {
  let { id } = useParams();

  return (
    <QnaireProvider>
      <Questionnaire id={id} />
      <QnaireErrorDialog />
    </QnaireProvider>

    //   {/* <br /> <br /> <hr />
    //   <Typography variant="h2">Creation page</Typography>
    //   <Typography variant="h3">Potential range question display:</Typography>
    //   <SmileyRating />
    //   <InputSlider />
    //   <InputSlider step={0.1} max={1.1} />
    //   <InputSlider step={null} max={10} />
    //   <NumField /> */}
  );
}
