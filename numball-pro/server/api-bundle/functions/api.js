const serverless = require('serverless-http');
const app = require('../app');

const handler = serverless(app.default || app);

exports.handler = async (event, context) => {
  return handler(event, context);
};
