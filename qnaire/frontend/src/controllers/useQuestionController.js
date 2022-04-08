import React, { useEffect, useState, useCallback } from "react";
import qnaireSource from "../data/QnaireSource";
import { useGenericController } from "./useGenericController";

export function useQuestionController(id) {
  const questionSource = qnaireSource.questionSource;

  const [data, regularUpdate, destroy] = useGenericController(questionSource, id);
  const update = useCallback(
    (updatedData) => {
      if ("resourcetype" in updatedData) {
        //... TODO
      } else {
        regularUpdate({ ...updatedData, resourcetype: data.resourcetype });
      }
    },
    [id]
  );

  return { ...data, update, destroy };
}
