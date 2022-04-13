import React, { useEffect, useState, useCallback } from "react";
import qnaireSource from "../data/QnaireSource";
import { useGenericController } from "./useGenericController";
import * as yup from "yup";

const baseValidationSchema = yup.object({
  text: yup.string().required("Text otázky musí být neprázdný"),
});

export function useQuestionController(id, validationSchema = null) {
  const questionSource = qnaireSource.questionSource;
  validationSchema = validationSchema
  ? baseValidationSchema.concat(validationSchema)
  : baseValidationSchema;;

  const [data, regularUpdate, destroy, cancelPendingUpdate] =
    useGenericController(questionSource, id, validationSchema);
  const update = (updatedData, shouldSourceUpdate = true) => {
    if ("resourcetype" in updatedData) {
      cancelPendingUpdate();
      // there might be an issue if an update was sent shortly before this one
      // if the response to this one arrives before the first one, because react could have destroyed the old component by then
      questionSource.updateType(id, updatedData.resourcetype);
    } else {
      regularUpdate(
        { ...updatedData, resourcetype: data.resourcetype },
        shouldSourceUpdate
      );
    }
  };

  return { ...data, update, destroy };
}
