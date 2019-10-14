const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
  const member = message.author;
  const queueType = message.channel.topic;
  const category = message.channel.parent;
  
  if (category.name !== 'Game Modes') return;
  
  const queue = client.server.getUncompleteQueueByType(queueType);

  if (!queue) return;

  if (queue.players.includes(member)) {
    queue.players = queue.players.filter(player => player !== member);
    client.server.playersQueued = client.server.playersQueued.filter(player => player !== member);

    if (queue.players.length < 1) {
      const cancelEmbed = new Discord.RichEmbed()
        .setAuthor(queue.name, 'https://i.imgur.com/radG4jv.png')
        .setDescription('All players left the queue. The lobby has been cancelled.');
      message.channel.send(cancelEmbed);
      client.server.deleteQueue(queue.id);
    } else {
      const embed = new Discord.RichEmbed()
        .setAuthor(queue.name, 'https://i.imgur.com/radG4jv.png')
        .setDescription(`${message.author.username} has left.`)
        .setFooter(queue.players.length === 1 ? (`There is 1 player in the queue out of ${queue.size}.`) : (`There are ${queue.players.length} players in the queue out of ${queue.size}.`));
      message.channel.send(embed);
    }

  }
}

module.exports.help = {
  name: 'leave',
}
