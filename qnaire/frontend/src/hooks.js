import React, {
  useContext,
  useEffect,
  useState,
  useReducer,
  useMemo,
} from "react";

//do an effect when timeout passes, if the component is rerendered during the timeout, the timeout is reset
function useTimeoutEffect(callback, array, timeout = 1000) {
  useEffect(() => {
    const timerId = setTimeout(() => {
      callback();
    }, timeout);

    return () => clearTimeout(timerId);
  }, array);
}

export const useForceRender = () => {
  const [, forceRender] = useReducer((oldVal) => oldVal + 1, 0);
  return forceRender;
};