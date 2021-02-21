module.exports = {
  name: 'messageReactionRemove',
  async execute (client, reaction, user) {
    if (user.bot) return;
    client.server.updateLobby(reaction, user, 'messageReactionRemove');
  }
}
