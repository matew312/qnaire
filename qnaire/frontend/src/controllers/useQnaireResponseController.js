import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import qnaireSource from "../data/QnaireSource";
import { useQnaireContext } from "../providers/QnaireProvider";
import { useBaseQnaireController } from "./useBaseQnaireController";

export function useQnaireResponseController(id, privateId, isPreview) {
  const { data, update, ...baseQnaireController } = useBaseQnaireController(id);
  const [sections, setSections] = useState(null);
  const [sectionIdxStack, setSectionIdxStack] = useState([]);
  const [skipToSectionId, setSkipToSectionId] = useState(null);
  const [isDone, setIsDone] = useState(false); // if the response was successfully submited

  useEffect(() => {
    qnaireSource.retrieve(id).then((data) => {
      update(data, false); //passed shouldSourceUpdate=false to prevent unnecessary api call
      const sectionSource = qnaireSource.sectionSource;
      setSections(sectionSource.getSortedSections());
    });
  }, [id]);

  const submitResponse = () => {
    //do validation

    if (isPreview) {
      setIsDone(true);
    }
    // qnaireSource.createResponse
  };

  let currentSectionIdx = null;
  let currentSection = null;
  let isIntro = true;
  let isLastSection = false;
  let totalSections = null;
  // let isFirstSection = false;
  if (sections && sectionIdxStack.length > 0) {
    currentSectionIdx = sectionIdxStack[sectionIdxStack.length - 1];
    currentSection = sections[currentSectionIdx];
    totalSections = sections.length;
    isIntro = false;
    isLastSection = currentSectionIdx === sections.length - 1;
    // isFirstSection = currentSectionIdx === 0;
  }

  const goToNextSection = () => {
    //do validation

    if (!skipToSectionId) {
      setSectionIdxStack((sectionIdxStack) => {
        if (sectionIdxStack.length > 0) {
          const nextSectionIdx =
            sectionIdxStack[sectionIdxStack.length - 1] + 1;
          return [...sectionIdxStack, nextSectionIdx];
        } else {
          return [0];
        }
      });
    } else {
      setSectionIdxStack((sectionIdxStack) => [
        ...sectionIdxStack,
        sections.findIndex((section) => section.id === skipToSectionId),
      ]);
    }
  };
  const goToPreviousSection = () => {
    setSectionIdxStack((sectionIdxStack) => {
      const newSectionIdxStack = Array.from(sectionIdxStack);
      newSectionIdxStack.pop();
      return newSectionIdxStack;
    });
  };

  return {
    ...baseQnaireController,
    qnaire: data,
    isLoaded: Boolean(data.id) && Boolean(sections),
    submitResponse,
    currentSection,
    totalSections,
    isLastSection,
    // isFirstSection,
    isIntro,
    goToNextSection,
    goToPreviousSection,
    submitResponse,
    isDone,
  };
}
