const message = require("../events/message");

module.exports = class Lobby {
  id;
  message;
  players = [];
  channels = [];
  time = 60;
  stage = 1;
  author;
  gamemode;
  size;
  name;
  timer = 300;

  constructor (author, message) {
    this.author = author;
    this.id = message.id;
    this.message = message;
  }

  isPlayerQueuedOrAuthor = (player) => {
    if (this.author == player) return true;
    if (this.players.includes(player)) return true;
    return false;
  }

  isPlayerQueuedOrOtherAuthor = (player, lobbyId) => {
    if (this.author == player && this.id !== lobbyId) return true;
    if (this.players.includes(player)) return true;
    return false;
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
        message.react(emojis.cancel);
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
        message.react(emojis.cancel);
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
    const Channel = require('./channel');
    const category = reaction.message.channel.parent;

    if (this.size === 2) {
      const channel = await reaction.message.guild.channels.create(this.name, {type: 'voice', parent: category});
      this.channels.push(new Channel(channel.id));
    } else if (this.size > 2) {
      const channelA = await reaction.message.guild.channels.create(this.name + ' A', {type: 'voice', parent: category});
      const channelB = await reaction.message.guild.channels.create(this.name + ' B', {type: 'voice', parent: category});
      this.channels.push(new Channel(channelA.id), new Channel(channelB.id));
    }
  }

  checkChannels = () => {
    if (this.stage === 4) {
      const channels = this.channels.filter(channel => !channel.deleted);
      if (!channels.length) {
        this.stage = 5;
      }
    }
  }

  cancel = (reason) => {
    this.stage = 6;
    const embed = this.message.embeds[0];
    embed.fields = [];
    embed.setColor('#c94a53');
    if (reason === 1) {
      embed.setDescription(
        `This lobby has been canceled. Lobby creation never finished or not all players joined in time.
        
        Lobby must be created and all players must join within 5 minutes.`);
    } else if (reason === 2) {
      embed.setDescription(
        `This lobby was canceled by the host.`);
    }
    embed.setFooter('This message will self destruct in 1 minute.');
    this.message.edit(embed).then((message) => {
      message.reactions.removeAll();
      setTimeout(() => {
        message.delete();
        this.isError = false;
      }, 60 * 1000);
    });
  }

}