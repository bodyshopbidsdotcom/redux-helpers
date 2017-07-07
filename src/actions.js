/**
 * Status enum for actions, mainly needed for async actions but should be used for all
 * @type {Object}
 */
export const FetchStatus = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  PENDING: "PENDING"
};


/**
 * Helper for creating actions to dispatch for redux store
 *
 * e.g.
 * dispatch(createAction("GET_ITEM", Status.SUCCESS, { data: 1 }));
 *
 * @param  {String} type      [Action name/type]
 * @param  {Status} status    [String status, e.g. SUCCESS]
 * @param  {Object} [data={}] [Data to pass along with the action to the reducer]
 * @return {Object}           [Created object]
 */
export function createAction(type, status, data = {}) {
  return {
    type,
    status,
    ...data
  };
}

/**
 * Helper for creating action creating functions of a given type
 *
 * e.g.
 * const getItemAsync = createActionCreator('GET_ITEM');
 * ...
 * dispatch(getItemAsync(Status.PENDING));
 * getItem(...).then(result => dispatch(getItemAsync(Status.SUCCESS, { item: result })));
 *
 * @param  {String} type [Action name/type]
 * @return {Function}      [Action creating function]
 */
export function createActionCreator(type) {
  return (status, data = {}) => createAction(type, status, data);
}

export function getAjaxTypes(type) {
  return {
    error: `${type}_ERROR`,
    pending: `${type}_PENDING`,
    success: `${type}_SUCCESS`
  };
}
