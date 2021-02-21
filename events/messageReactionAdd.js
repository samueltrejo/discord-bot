module.exports = {
  name: 'messageReactionAdd',
  async execute (client, reaction, user) {
    if (user.bot) return;
    client.server.updateLobby(reaction, user, 'messageReactionAdd');
  }
}
