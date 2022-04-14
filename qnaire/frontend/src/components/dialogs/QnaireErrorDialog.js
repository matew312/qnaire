import * as React from "react"
import ErrorDialog from "../basic/ErrorDialog";
import { useQnaireContext } from "../../providers/QnaireProvider";

export function QnaireErrorDialog() {
  const { error, setError } = useQnaireContext();
  return error !== "" ? (
    <ErrorDialog text={error} open={true} onClose={() => setError("")} />
  ) : null;
}
