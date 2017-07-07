import { FetchStatus, getAjaxTypes } from './actions';

function createAjaxHandler(state, action, fetchingStatusName, fetchStatus, extrasTransformer) {
  const extra = (extrasTransformer && extrasTransformer(state, action)) || {};
  return {
    ...state,
    ...extra,
    [fetchingStatusName]: fetchStatus
  };
}

export default function createAjaxHandlers(type, fetchingStatusName, customTransformers = {}) {
  const { pending, success, error } = getAjaxTypes(type);
  const { pending: pendingTransformer, success: successTransformer, error: errorTransformer} = customTransformers;
  return {
    [pending]: (state, action) => createAjaxHandler(state, action, fetchingStatusName, FetchStatus.PENDING, pendingTransformer),
    [success]: (state, action) => createAjaxHandler(state, action, fetchingStatusName, FetchStatus.SUCCESS, successTransformer),
    [error]: (state, action) => createAjaxHandler(state, action, fetchingStatusName, FetchStatus.ERROR, errorTransformer)
  };
}
