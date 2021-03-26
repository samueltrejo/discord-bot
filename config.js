const config = {
  token: '',
  prefix: '!',
  maintenance: false,
  message: {
    info: 'Ready',
    error: 'Down'
  }
}

if (process.env.token) {
  config.token = process.env.token;
} else {
  config.token = require('./token.js');
}

if (process.env.maintenance) {
  config.maintenance = process.env.maintenance === 'true';
  console.log('maintenance mode is set to ' + process.env.maintenance);
}

module.exports = config;
