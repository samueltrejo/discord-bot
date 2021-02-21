module.exports = {
  name: 'lobby',
  async execute (client, message, args) {
    client.server.startLobby(message);
  }
}
