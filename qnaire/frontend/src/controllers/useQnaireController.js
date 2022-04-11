import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import qnaireSource from "../data/QnaireSource";
import { useQnaireContext } from "../providers/QnaireProvider";
import { useGenericController } from "./useGenericController";

export function useQnaireController(id) {
  const [data, update] = useGenericController(qnaireSource, id);
  const [isLoaded, setIsLoaded] = useState(false);
  const { setError } = useQnaireContext();

  //technically, just the ids are needed, but there is no reason to not keep object references
  const [sections, setSections] = useState(null);

  const handleSectionOrderChange = () => {
    setSections(qnaireSource.sectionSource.getSortedSections());
  };

  function handleDragEnd(result) {
    const { destination, source, draggableId, type } = result;
    if (!destination) {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    //const newSections = Array.from(sections);
    //It's not really possible to do an optimistic update,
    //because I don't have access to the section's state
    //(and the whole reason why I'm using listeners is that when I lifted state up the performance was horrendous)

    const dataSource = qnaireSource.getSource(type);
    dataSource
      .move(
        parseInt(draggableId),
        destination.index,
        parseInt(destination.droppableId) //ignored in sectionSource and choiceSource
      )
      .catch((error) => {
        setError(JSON.stringify(error));
      });
  }

  const navigate = useNavigate();

  const publish = ({ isPrivate, isAnonymous }) => {
    update({
      private: isPrivate,
      anonymous: isAnonymous,
      published: true,
    }).then((data) => {
      navigate("/questionnaires");
    });
  };

  useEffect(() => {
    qnaireSource.retrieve(id).then((data) => {
      update(data, false); //passed shouldSourceUpdate=false to prevent unnecessary api call
      const sectionSource = qnaireSource.sectionSource;
      setSections(sectionSource.getSortedSections());
      setIsLoaded(true);
      sectionSource.subscribeMove(handleSectionOrderChange);
      sectionSource.subscribeCreate(handleSectionOrderChange);
      sectionSource.subscribeDelete(handleSectionOrderChange);

      //there is not really a need to unsub because qnaire never gets deleted while this component is alive
      return () => {
        sectionSource.unsubscribeMove(handleSectionOrderChange);
        sectionSource.unsubscribeCreate(handleSectionOrderChange);
        sectionSource.unsubscribeDelete(handleSectionOrderChange);
      };
    });
  }, [id]);

  return { ...data, sections, update, publish, isLoaded, handleDragEnd };
}
