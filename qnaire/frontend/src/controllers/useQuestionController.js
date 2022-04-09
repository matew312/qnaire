import React, { useEffect, useState, useCallback } from "react";
import qnaireSource from "../data/QnaireSource";
import { useGenericController } from "./useGenericController";

export function useQuestionController(id) {
  const questionSource = qnaireSource.questionSource;

  const [data, regularUpdate, destroy, cancelPendingUpdate] =
    useGenericController(questionSource, id);
  const update = (updatedData) => {
    if ("resourcetype" in updatedData) {
      cancelPendingUpdate();
      //questionSource.updateType(id, updatedData.resourcetype);
      //TODo...
    } else {
      regularUpdate({ ...updatedData, resourcetype: data.resourcetype });
    }
  };

  return { ...data, update, destroy };
}
