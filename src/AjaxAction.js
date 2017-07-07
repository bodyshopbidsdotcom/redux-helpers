import { getAjaxTypes } from './actions';

const setters = [
  'call', // Set the call function: (client) => client.getJson(...)
  'data', // Extra data to pass through the action
  'force', // Set whether to force call: skips the shouldPerform and checkIfInCache
  'skipIfInCache', // Set the skipIfInCache function: (getState) => true|false
  'shouldPerform' // Set the shouldPerform function: (getState) => true|false
];

export default class AjaxAction {
  constructor(type) {
    this._locals = {
      types: getAjaxTypes(type)
    };

    setters.forEach(setter => {
      this[setter] = (value) => {
        this._locals[setter] = value;
        return this;
      };
    });
  }

  toReduxAction() {
    const {
      call,
      data,
      force,
      skipIfInCache,
      shouldPerform,
      types: { pending, success, error }
    } = this._locals;

    return {
      ajax: call,
      types: [pending, success, error],
      data: data,
      shouldPerform: shouldPerform,
      checkIfInCache: skipIfInCache,
      force
    };

  }
}
