import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import qnaireSource from "../data/QnaireSource";
import { useGenericController } from "./useGenericController";

export function useQnaireListController(id) {
  const [qnaires, update] = useGenericController(qnaireSource, id);
  const [isLoaded, setIsLoaded] = useState(false);

  // const navigate = useNavigate();

  // const publish = ({ isPrivate, isAnonymous }) => {
  //   update({
  //     private: isPrivate,
  //     anonymous: isAnonymous,
  //     published: true,
  //   }).then((data) => {
  //     navigate("/questionnaires");
  //   });
  // };

  useEffect(() => {
    qnaireSource.retrieveAll().then((qnaires) => {
      update(qnaires, false); //passed shouldSourceUpdate=false to prevent unnecessary api call
      setIsLoaded(true);
    });
  }, [id]);

  return { qnaires, isLoaded };
}
