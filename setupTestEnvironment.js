// source: https://github.com/kentcdodds/react-ava-workshop/blob/master/test/helpers/setup-test-env.js
/**
 * This is used to set up the environment that's needed for most
 * of the unit tests for the project which includes babel transpilation
 * with babel-register, polyfilling, and initializing the DOM with jsdom
 */
require('babel-register');
require('babel-polyfill');
require('browser-env')(['window', 'document', 'navigator']);
