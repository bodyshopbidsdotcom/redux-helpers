/**
 * Simplifies writing api dispatching actions
 *
 * Lets you write actions like this:
 *
 * export function actionName(data) {
 *   return {
 *     types: [LOGIN, LOGIN_SUCCESS, LOGIN_ERROR],    // REQUIRED: Your action types to use
 *     ajax: (apiClient) => apiClient.postJson(...),  // REQUIRED: Your api call
 *     chain: true,                                   // OPTIONAL: default - false, rethrows the error so you can handle errors after calling dispatch,
 *     shouldPerform: (getState) => <Boolean>,        // OPTIONAL: allows you to end the promise early
 *     force: <Boolean>                               // OPTIONAL: Force the ajax call, so that it won't be cached
 *     fromCache: (getState) => <Boolean>             // OPTIONAL: Check if the item is already cached in the store and if it is, just return. This would be better if it returned the actual item in the promise
 *     after: (dispatch, getState, promise) => {}     // OPTIONAL: allows you to attach handlers to the promise after it is done
 *   };
 * }
 *
 * @param  {ApiClient} ApiClient helper constructor(dispatch, getState)
 * @return {[type]}           [description]
 */
export default function createApiMiddleware(ApiClient) {
  return function apiMiddleware({ dispatch, getState }) {
    return next => action => {
      // if the action is a function then call it with dispatch and getState, similar to thunk
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { ajax, types, data } = action;
      // if the action doesn't have `ajax` and `types` then it's probably not an api action
      // so let's just let redux do its thing
      if (!ajax || !types) {
        return next(action);
      }

      if (!action.force) {
        if (action.shouldPerform && !action.shouldPerform(getState)) {
          return Promise.resolve('skipped');
        }
        if (action.checkIfInCache && action.checkIfInCache(getState)) {
          return Promise.resolve('from cache');
        }
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      // dispatch first request event so can set `isFetching: true` on the resource
      next({ // eslint-disable-line
        data,
        type: REQUEST
      });

      return ajax(new ApiClient(dispatch, getState))
        .then(
          // dispatch success event so can set `isFetching: false` on the resource
          // // And pass the response data as `data`. e.g. so you can use `action.data.result`
          response => {
            next({ // eslint-disable-line
              data,
              response,
              type: SUCCESS
            });
            return data;
          },
          error => {
            if (process.env.NODE_ENV === 'development') {
              console.error('Api Error:', error, action);
            }
            next({ // eslint-disable-line
              data,
              error,
              type: FAILURE
            });
            return Promise.reject(error);
          }
        );
    };
  };
}
