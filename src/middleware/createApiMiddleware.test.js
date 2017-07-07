import test from 'ava';
import configureStore from 'redux-mock-store';
import createApiMiddleware from './createApiMiddleware';
import sinon from 'sinon';

const FETCH = 'FETCH';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_ERROR = 'FETCH_ERROR';

test.beforeEach(t => {
  const ApiClient = function () {};
  t.context.ApiClient = ApiClient;
  const middlewares = [createApiMiddleware(ApiClient)];
  t.context.mockStore = configureStore(middlewares);
});

test('Successful ajax call', async t => {
  const store = t.context.mockStore({});
  const responseData = {
    result: 'IT WORKED'
  };
  t.context.ApiClient.prototype.getJson = sinon.mock().returns(Promise.resolve(responseData));

  await store.dispatch({
    types: [FETCH, FETCH_SUCCESS, FETCH_ERROR],
    ajax: (apiClient) => apiClient.getJson('/test')
  });

  const actions = store.getActions();
  t.is(actions[0].type, FETCH);
  t.is(actions[1].type, FETCH_SUCCESS);
  t.is(actions[1].response, responseData);
});

test('Error ajax call', async t => {
  const store = t.context.mockStore({});
  const error = {
    message: 'uh oh something happened'
  };
  t.context.ApiClient.prototype.getJson = sinon.mock().returns(Promise.reject(error));

  await store.dispatch({
    types: [FETCH, FETCH_SUCCESS, FETCH_ERROR],
    ajax: (apiClient) => apiClient.getJson('/test')
  }).catch(error => store.dispatch({type: 'error handled'}));

  const actions = store.getActions();
  t.is(actions[0].type, FETCH);
  t.is(actions[1].type, FETCH_ERROR);
  t.is(actions[1].error, error);
  t.is(actions[2].type, 'error handled');
});

test('shouldPerform prevents perform', async t => {
  const store = t.context.mockStore({
    isFetching: true
  });
  t.context.ApiClient.prototype.getJson = sinon.mock().returns(Promise.resolve(200));

  const result = await store.dispatch({
    shouldPerform: (getState) => !getState().isFetching,
    types: [FETCH, FETCH_SUCCESS, FETCH_ERROR],
    ajax: (apiClient) => apiClient.getJson('/test')
  });

  const actions = store.getActions();
  t.is(actions[0], undefined);
  t.is(result, 'skipped');
});


test('success action finishes before the `after` callback: (...) => promise.then', async t => {
  const store = t.context.mockStore({
    isFetching: true
  });
  t.context.ApiClient.prototype.getJson = sinon.mock().returns(Promise.resolve(200));

  await store.dispatch({
    types: [FETCH, FETCH_SUCCESS, FETCH_ERROR],
    ajax: (apiClient) => apiClient.getJson('/test')
  }).then(result => {
    return store.dispatch({ type: 'AFTER' });
  });

  const actions = store.getActions();
  t.is(actions[0].type, FETCH);
  t.is(actions[1].type, FETCH_SUCCESS);
  t.is(actions[1].response, 200);
  t.is(actions[2].type, 'AFTER');
});
