import { TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EditableText } from "../basic/EditableText";
import { InputSlider } from "../basic/InputSlider";
import { NumField } from "../basic/NumField";
import { SmileyRating } from "../basic/SmileyRating";
import { Choice } from "../Choice";

export function CreationPage() {
  let { id } = useParams();
  useEffect(() => {
    fetch(`/api/questionnaires/${id}`)
      .then((response) => response.json())
      .then((data) => console.log(data));
  });

  return (
    <div>
      <Typography variant="h2">Creation page</Typography>
      <EditableText value="This text is editable" />
      <Choice value="This is an editable choice" />
      <Typography variant="h3">Potential range question display:</Typography>
      <SmileyRating />
      <InputSlider />
      <NumField />

    </div>
  );
}
