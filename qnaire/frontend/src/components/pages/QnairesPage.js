import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

export function QnairesPage() {
  useEffect(() => {
    fetch("/api/questionnaires/")
      .then((response) => response.json())
      .then((data) => console.log(data));
  });

  return <h1>Qnaires page</h1>;
}
