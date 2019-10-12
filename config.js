const config = {
  token: '',
  prefix: '!'
}

if (process.env.token) {
  config.token = process.env.token;
} else {
  config.token = require('./token.js');
}

module.exports = config;
