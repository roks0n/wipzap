process.env.BASE_URL = process.env.BASE_URL || 'https://wip.test';
process.env.CLIENT_ID = process.env.CLIENT_ID || '1234';
process.env.CLIENT_SECRET = process.env.CLIENT_SECRET || 'asdf';

const authentication = require('./authentication');
const completedTodo = require('./triggers/completedTodo');
const createdTodo = require('./triggers/createdTodo');
const products = require('./triggers/_products');
const completeTodo = require('./actions/completeTodo');
const createTodo = require('./actions/createTodo');
const createCompletedTodo = require('./actions/createCompletedTodo');

// To include the Authorization header on all outbound requests, simply define a function here.
// It runs runs before each request is sent out, allowing you to make tweaks to the request in a centralized spot
const includeBearerToken = (request, z, bundle) => {
  if (bundle.authData.access_token) {
    request.headers.Authorization = `Bearer ${bundle.authData.access_token}`;
  }
  return request;
};

const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  beforeRequest: [
    includeBearerToken
  ],

  afterResponse: [
  ],

  resources: {
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [completedTodo.key]: completedTodo,
    [createdTodo.key]: createdTodo,
    [createdTodo.key]: createdTodo,
    [products.key]: products,  // hidden trigger, used for dynamic fields
  },

  // If you want your searches to show up, you better include it here!
  searches: {
  },

  // If you want your creates (aka actions) to show up, you better include it here!
  creates: {
    [completeTodo.key]: completeTodo,
    [createTodo.key]: createTodo,
    [createCompletedTodo.key]: createCompletedTodo,
  }
};

module.exports = App;
