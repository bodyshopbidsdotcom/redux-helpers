# snapsheet-redux-helpers

Helpers to reduce boilerplate with redux.

[![npm version](https://img.shields.io/npm/v/snapsheet-redux-helpers.svg?style=flat-square)](https://www.npmjs.com/package/snapsheet-redux-helpers)
[![npm downloads](https://img.shields.io/npm/dm/snapsheet-redux-helpers.svg?style=flat-square)](https://www.npmjs.com/package/snapsheet-redux-helpers)

## Installation

    $ npm install snapsheet-redux-helpers --save

  or with yarn

    $ yarn add snapsheet-redux-helpers

## Api middleware
Using the api middle reduces boilerplate for async actions. Instead of writing actions for your apis like this:

```javascript
export function login(username, password) {
  return (dispatch, getState) => {
    dispatch({ type: 'LOGIN' });
    return postJSON('/api/v1/login', { username, password }).then(
      (data) => {
        dispatch({ type: 'LOGIN_SUCCESS', result: data });
        return data;
      },
      (error) => {
        // handle error
        dispatch({ type: 'LOGIN_ERROR', error: error })
        return Promise.reject(error);
      }
    );
  }
}
```

You can write them like this with the use of AjaxAction:

```javascript
export function login(username, password) {
  return new AjaxAction('LOGIN')
    .callAsync((apiClient) => apiClient.postJSON('/api/v1/login', { username, password }))
    .toReduxAction();
}
```

### Setting up api middleware
```javascript
import { createApiMiddleware } from 'snapsheet-redux-helpers';
```

You can also minimize the bundle by importing only the files you need

```javascript
import createApiMiddleware from 'snapsheet-redux-helpers/lib/createApiMiddleware';
```


```javascript
const middleware = [
  createApiMiddleware(ApiClient)
];

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(...middleware)
));
```

**NOTE**: you will need an ApiClient model to use. See [SampleApiClient](https://github.com/bodyshopbidsdotcom/redux-helpers/blob/master/demo/SampleApiClient.js) for
an example of how it could be setup. It should accept `dispatch, getState` in the constructor, but the rest is up to you! This allows you to generalize what happens whenever an ajax call is made, such as beginning a loading indicator,
displaying flash messages when an error occurs, or automatically adding params to requests. It also
gives you the freedom to use other libraries to make your requests. The only limitation is that each
action should return a `Promise`.

See [demo/index.js](https://github.com/bodyshopbidsdotcom/redux-helpers/blob/master/demo/index.js) for more example usage.

## Demo

    $ git clone https://github.com/bodyshopbidsdotcom/redux-helpers.git
    $ cd redux-helpers
    $ npm install
    $ npm run demo
    $ open http://localhost:3000

## Contributing
Please create an issue with any feature suggestions or bug reports. Pull requests are welcome.
