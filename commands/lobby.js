const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const member = message.author;
  const queueType = message.channel.topic;
  const category = message.channel.parent;
  
  if (category.name !== 'Game Modes') return;
  if (client.server.playersQueued.includes(member)) return;
  
  const queue = client.server.createQueue(queueType);

  if (queue.players.length === 0 && !queue.strictSize && args[0] && client.server.lobbyTypes[args[0]]) {
    queue.size = client.server.lobbyTypes[args[0]];
  }

  queue.players.push(member);
  client.server.playersQueued.push(member);

  const queueInfoEmbed = new Discord.RichEmbed()
    .setAuthor(`${queue.name}`, 'https://i.imgur.com/radG4jv.png')
    .addField(`${message.author.username} has joined.`,
      queue.players.length === 1 ? (`There is 1 player in the queue out of ${queue.size}.`) : (`There are ${queue.players.length} players in the queue out of ${queue.size}.`))
    .setFooter('Type !q to join the lobby.');
  message.channel.send(queueInfoEmbed);

  if (queue.players.length < queue.size) return

  queue.createLobbyChannel();
  const playerNames = queue.players.map(player => ` ${player.username}`);

  const queueCompleteEmbed = new Discord.RichEmbed()
    .setAuthor(`${queue.name}`, 'https://i.imgur.com/radG4jv.png')
    .addField('The lobby has been created.', `Please join the channel ${queue.name} within 10 minutes.`)
    .addField(`${playerNames}`, 'See the mode settings channel to get settings.');
  message.channel.send(queueCompleteEmbed);
}

module.exports.help = {
  name: 'lobby',
}
