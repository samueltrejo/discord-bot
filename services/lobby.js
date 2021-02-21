const message = require("../events/message");

module.exports = class Lobby {
  id;
  players = [];
  channels = [];
  time = 60;
  stage = 1;
  author;
  gamemode;
  size;
  name;

  constructor (author, messageId) {
    this.author = author;
    this.id = messageId;
  }

  getRandomNum = () => Math.floor(Math.random() * 8999) + 1000;

  selectGamemode (reaction, user, gameInfo, emojis) {
    if (user == this.author) {
      this.gamemode = gameInfo.gamemodes[emojis.letters.indexOf(reaction.emoji.name)];

      const embed = reaction.message.embeds[0];
      embed.fields = [];
      embed.setDescription(`You have selected ${this.gamemode} mode. ${user} please choose the lobby size.`);
      embed.addField('Status', 'Creating Lobby...');

      reaction.message.edit(embed).then((message) => {
        message.reactions.removeAll();
        const sizeEmojis = emojis.numbers.slice(2, gameInfo.maxPlayers + 1);
        sizeEmojis.forEach((emoji) => {
          message.react(emoji);
        });
      });

      this.stage = 2;
    } else {
      reaction.users.remove(user.id);
    }
  }

  selectSize (reaction, user, emojis) {
    if (user == this.author && emojis.numbers.includes(reaction.emoji.name)) {
      this.size = emojis.numbers.indexOf(reaction.emoji.name);

      const embed = reaction.message.embeds[0];
      embed.fields = [];
      embed.setDescription(`A new ${this.size} player lobby has been created for ${this.gamemode} mode.`);
      embed.addField('Players', '0 players in the queue.');
      embed.addField('Status', 'Queueing...');
      embed.addField('Help', 'To join the lobby click ☑️, click ☑️ again to leave.');

      reaction.message.edit(embed).then((message) => {
        message.reactions.removeAll();
        message.react('☑️');
      });

      this.stage = 3;
    } else {
      reaction.users.remove(user.id);
    }
  }

  joinLobby (reaction, user, gameInfo) {
    if (reaction.emoji.name === '☑️') {
      this.players.push(user);

      const embed = reaction.message.embeds[0];
      embed.fields = [];
      embed.addField('Players', `${this.players.join(' ')}`);

      if (this.players.length === this.size) {
        this.name = gameInfo.nickname + this.gamemode + this.getRandomNum();
        embed.setDescription(`The lobby ${this.name} has been created. Please join the lobby within 5 minutes.`);
        reaction.message.embeds[0].addField('Status', 'Complete');

        this.stage = 4;
      } else {
        embed.addField('Status', 'Queueing...');
        embed.addField('Help', 'To join the lobby click ☑️, click ☑️ again to leave.');
      }
      
      reaction.message.edit(embed);
    }
  }

  leaveLobby (reaction, user) {
    if (reaction._emoji.name === '☑️') {
      this.players = this.players.filter(player => player !== user);

      const playersString = this.players.length ? `${this.players.join(' ')}` : '0 players in the queue.';
      const embed = reaction.message.embeds[0];
      embed.fields = [];
      embed.addField('Players', playersString);
      embed.addField('Status', 'Queueing...');
      embed.addField('Help', 'To join the lobby click ☑️, click ☑️ again to leave.');

      reaction.message.edit(embed);
    }
  }

  async createChannels (reaction) {
    const category = reaction.message.channel.parent;

    if (this.size === 2) {
      const channel = await reaction.message.guild.channels.create(this.name, {type: 'voice', parent: category});
      channel.timer = 10;
      this.channels.push(channel);
    } else if (this.size > 2) {
      const channelA = await reaction.message.guild.channels.create(this.name + ' A', {type: 'voice', parent: category});
      const channelB = await reaction.message.guild.channels.create(this.name + ' B', {type: 'voice', parent: category});
      channelA.timer = 10;
      channelB.timer = 10;
      this.channels.push(channelA, channelB);
    }
  }

  checkChannels = () => {
    if (this.stage < 4) {
      this.channels = channels.filter((channel) => !channel.deleted);
      if (!this.channels.length) {
        this.stage = 5;
      }
    }

  }
}