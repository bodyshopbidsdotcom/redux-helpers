import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { createApiMiddleware, AjaxAction, createAjaxHandlers, createReducer } from 'snapsheet-redux-helpers';

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';

const initialState = { number: null };
const reducer = createReducer(initialState, {
  ...createAjaxHandlers('rand', 'randFetchStatus', {
    success: (state, action) => {
      return {
        number: action.response
      };
    }
  })
});

function createReduxStore (ApiClient) {
  const rootReducer = combineReducers({
    app: reducer
  });

  let composeEnhancers = compose;

  const middlewares = [createApiMiddleware(ApiClient)];

  if (process.env.NODE_ENV !== 'production') {
    if (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
  }

  return createStore(rootReducer, composeEnhancers(
    applyMiddleware(...middlewares)
  ));
}


class ApiClient {
  constructor(dispatch, getState) {
    this.dispatch = dispatch;
    this.getState = getState;
  }

  doAsync(next) {
    return new Promise((resolve, reject) => setTimeout(() => resolve(next()), 1000));
  }
}

function createRandomNumber() {
  return new AjaxAction('rand')
    .call((apiClient) => apiClient.doAsync(() => Math.ceil(Math.random() * 100)))
    .toReduxAction();
}

@connect((state, props) => {
  return {
    status: state.app.randFetchStatus,
    number: state.app.number
  };
})
class App extends Component {
  static propTypes = {
    status: PropTypes.string,
    number: PropTypes.number,
    dispatch: PropTypes.func
  };
  onClick = () => {
    this.props.dispatch(createRandomNumber());
  }
  render() {
    return (
      <div>
        <p><label>Status: </label> {this.props.status === null ? 'None' : this.props.status}</p>
        <p><label>Current Number: </label> {this.props.number}</p>
        <button type="button" onClick={this.onClick} disabled={this.props.status === 'PENDING'}>Update</button>
      </div>
    );
  }
}

const store = createReduxStore(ApiClient);

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'));
