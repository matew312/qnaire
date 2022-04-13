import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppContext } from "../../providers/AppContextProvider";

export function ResponsePage() {
  const { id, privateId } = useParams();
  //check if privateId undefined and handle accordingly (based on whether qnaire is aunonymous)

  const [searchParams, setSearchParams] = useSearchParams();
  const preview = Boolean(searchParams.has("preview"));
  const { setPageActions, setDrawerDisabled } = useAppContext();

  useEffect(() => {
    setPageActions([]);
    setDrawerDisabled(true);

    return () => setDrawerDisabled(false);
  }, []);

  return <h1>Response page (preview={preview.toString()})</h1>;
}
