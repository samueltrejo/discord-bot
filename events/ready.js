module.exports = {
  name: 'ready',
  async execute (client) {
    const Server = require('../services/server');
    const firebase = require('../data/firebase');
    firebase.init();
    games = await firebase.get('games');
    client.server = new Server(client, games);
    client.server.channelsInterval = setInterval(client.server.deleteChannelsCheck.bind(null, client), 1000);
    console.error(client.config.message.info);
  }
}
