import ExtendableError from 'extendable-error';

export class ApiError extends ExtendableError {
  constructor(message, statusCode, data = null, errorDetails = null) {
    super(message); // string message of error (required)
    this.statusCode = statusCode; // HTTP status (required)
    this.data = data; // json data parsed from response (optional)
    this.errorDetails = errorDetails; // extra data about the error (optional)
  }
}

const ContentType = {
  JSON: 'application/json'
};

function getJsonHeaders() {
  return {
    'Accept': ContentType.JSON,
    'Content-Type': ContentType.JSON
  };
}

function parseJsonResponse(response) {
  const isOK = response.status >= 200 && response.status < 300;
  const isJSON = (response.headers.get('Content-Type') || '').includes(ContentType.JSON);

  if (!isJSON) {
    throw new ApiError('Response is not JSON', response.status, response);
  }

  return response.json().then(data => {
    if (!isOK || (data && data.error)) {
      throw new ApiError(data.error.message, response.status, data);
    }

    return data;
  });
}

function doXHRJson(method, url, body, options = {}) {
  const fetchParams = {
    method: method,
    headers: getJsonHeaders(),
    credentials: 'same-origin'
  };

  if (body && ["post", "put"].includes(method.toLowerCase())) {
    fetchParams.body = JSON.stringify(body);
  }

  // if (options.token) {
  //   fetchParams.headers['Authorization'] = `Bearer ${options.token}`;
  //   delete options.token;
  // }

  return fetch(url, fetchParams);
}

export default class ApiClient {
  constructor(dispatch, getState) {
    this.getState = getState;
    this.dispatch = dispatch;
  }

  performAjax(method, url, body, _options = {}) {
    // this.dispatch(beginLoading());
    // const state = this.getState();

    const options = {
      ..._options
      // token: state.user.token
    };

    return doXHRJson(method, url, body, options)
      .then(parseJsonResponse)
      .then(
        (data) => {
          // this.dispatch(endLoading());
          return data;
        },
        (error) => {
          // this.dispatch(endLoading());
          // this.dispatch(displayErrorMessage(error));

          return Promise.reject(error);
        }
      );
  }

  getJson(url, options) {
    return this.performAjax("get", url, null, options);
  }

  postJson(url, body, options) {
    return this.performAjax("post", url, body, options);
  }

  putJson(url, body, options) {
    return this.performAjax("put", url, body, options);
  }

  deleteJson(url, options) {
    return this.performAjax("delete", url, null, options);
  }
}
