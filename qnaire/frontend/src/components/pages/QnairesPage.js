import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRequireAuth } from "../../auth";
import { GET } from "../../request";
import { useAppContext } from "../../providers/AppContextProvider";

export function QnairesPage() {

  useEffect(() => GET("questionnaires"), []);

  const {setPageActions} = useAppContext();
  useEffect(() => setPageActions([]), []);

  return <h1>Qnaires page</h1>;
}
