import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAuthHeader } from "../../auth";
import { handleErrors } from "../../network";

export function QnairesPage() {
  useEffect(() => {
    fetch("/api/questionnaires/", {
      headers: { Authorization: getAuthHeader() },
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((data) => console.log(data));
  });

  return <h1>Qnaires page</h1>;
}
