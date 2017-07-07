export default function createReducer(initialState, handlers) {
  return (state = initialState, action) => {
    const { type } = action;
    if (handlers[type]) {
      return handlers[type](state, action);
    }
    return state;
  };
}
