export function combineReducers(reducers) {
  return (state, action) => {
    const newState = {};

    Object.keys(reducers).forEach((key) => {
      newState[key] = reducers[key](state ? state[key] : null, action);
    });

    return newState;
  };
}
