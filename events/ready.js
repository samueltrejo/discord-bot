const Server = require('../classes');
const channelDelete = require('../intervals/channelDelete');

module.exports.run = async client => {
  console.log('bot online');
  const server = new Server(client);
  client.server = server;

  client.setInterval(channelDelete, 1000, client);
}

module.exports.help = {
  name: 'ready',
}
