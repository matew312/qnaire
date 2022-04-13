import * as React from "react";
import { useParams, useSearchParams } from "react-router-dom";

export function ResponsePage() {
  const { id, privateId } = useParams();
  //check if privateId undefined and handle accordingly (based on whether qnaire is aunonymous)

  const [searchParams, setSearchParams] = useSearchParams();
  const preview = Boolean(searchParams.has('preview'));

  return <h1>Response page (preview={preview.toString()})</h1>;
}
