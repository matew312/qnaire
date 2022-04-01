import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRequireAuth } from "../../auth";
import { GET } from "../../request";

export function QnairesPage() {

  useEffect(() => GET("questionnaires", (data) => {}), []);

  return <h1>Qnaires page</h1>;
}
