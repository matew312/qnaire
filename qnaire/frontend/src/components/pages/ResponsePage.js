import * as React from "react";
import { useParams } from "react-router-dom";

export function ResponsePage() {
  const { id, privateId } = useParams();
  //check if privateId undefined and handle accordingly (based on whether qnaire is aunonymous)

  return <h1>Response page</h1>;
}
