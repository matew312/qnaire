import React, { useContext, useState } from "react";

const AppContext = React.createContext();

const initialState = { pageActions: [] };

export function AppContextProvider({ children }) {
  const [state, setState] = useState(initialState);

  function setPageActions(pageActions) {
    setState((state) => {
      return { ...state, pageActions };
    });
  }

  const value = {
    ...state,
    setPageActions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
