const lobby = require('../commands/lobby');
const message = require('../events/message');

module.exports = class Server {
  games = [];
  isError = false;
  channelsInterval;
  defaultCategories = ['important', 'general', 'staff'];
  emojis = {
    numbers: ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'],
    letters: ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿']
  }

  constructor(client, games) {
    const Game = require('./game');
    games.forEach((game) => {
      const category = client.channels.cache.find(channel => channel.type === 'category' && !this.defaultCategories.includes(channel.name));
      this.games.push(new Game(game, category));
    });
  }

  getGame = name => this.games.find(game => game.name === name);

  isLobbyStartBlocked = (game, player) => {
    if (game.activeLobbies.filter((lobby) => lobby.isPlayerQueuedOrAuthor(player)).length) return true;
    return false;
  }

  isQueueLobbyBlocked = (game, player, lobbyId) => {
    if (game.activeLobbies.filter((lobby) => lobby.isPlayerQueuedOrOtherAuthor(player, lobbyId)).length) return true;
    return false;
  }

  startLobby = (message) => {
    const game = this.getGame(message.channel.parent.name);

    if (!game) return;

    if (this.isLobbyStartBlocked(game, message.author)) {
      message.delete();
      return;
    };

    if (game.activeLobbies.length >= 3 && !this.isError) {
      this.isError = true;
      message.embed = this.getErrorEmbed('max lobbies');
      this.sendErrorMessage(message, 30);
    } else {
      message.embed = this.getInfoEmbed('start lobby', message.author, game);
      this.sendInfoMessage(message, game);
    }

    message.delete();
  }

  updateLobby = (reaction, user, eventName) => {
    const game = this.getGame(reaction.message.channel.parent.name);
    if (!game) return;

    const lobby = game.getLobby(reaction.message.id);
    if (lobby) {
      if (lobby.stage === 1 && eventName === 'messageReactionAdd') {
        lobby.selectGamemode(reaction, user, game.info, this.emojis);
      } else if (lobby.stage === 2 && eventName === 'messageReactionAdd') {
        lobby.selectSize(reaction, user, this.emojis);
      } else if (lobby.stage === 3 && eventName === 'messageReactionAdd') {
        if (this.isQueueLobbyBlocked(game, user, reaction.message.id)) {
          reaction.users.remove(user.id);
          return;
        } else {
          lobby.joinLobby(reaction, user, game.info);
        }
      } else if (lobby.stage === 3 && eventName === 'messageReactionRemove') {
        lobby.leaveLobby(reaction, user);
      }

      if (lobby.stage === 4) {
        game.completeLobby(lobby.id);
        lobby.createChannels(reaction);
      }
    }
  }

  getInfoEmbed = (info, author, game) => {
    const Discord = require('discord.js');
    const embed = new Discord.MessageEmbed().setColor('#9abf88').setTitle(game.info.name);

    if (info === 'start lobby') {
      embed.setDescription(`Lobby initiated. ${author} please choose a gamemode for this lobby.`);
      embed.addField('Gamemodes', game.info.gamemodes.map((gamemode, index) => `${this.emojis.letters[index]}=${gamemode}`).join(', '));
      embed.addField('Status', 'Creating Lobby...');
    }

    return embed;
  }

  getErrorEmbed = (error) => {
    const Discord = require('discord.js');
    const embed = new Discord.MessageEmbed().setColor('#c94a53').setTitle('Error');
    
    if (error === 'max lobbies') {
      embed.setDescription('Sorry there can only be 3 lobbies queueing at a time. Please try again in a few minutes.');
      embed.setFooter('This message will self destruct in 30 seconds.');
    }

    return embed;
  }

  sendInfoMessage = (messageRef, game) => {
    messageRef.channel.send(messageRef.embed).then((message) => {
      game.info.gamemodes.forEach((gamemode, index) => {
        message.react(this.emojis.letters[index]);
      });
      game.createLobby(messageRef.author, message);
    });
  }

  sendErrorMessage = (messageRef, time) => {
    messageRef.channel.send(messageRef.embed).then((message) => {
      setTimeout(() => {
        message.delete();
        this.isError = false;
      }, time * 1000);
    })
  }

  deleteChannelsCheck = (client) => {
    this.games.forEach((game) => {

      game.activeLobbies.forEach((lobby) => {
        if (lobby.stage < 4) {
          lobby.timer -= 1;
          if (lobby.timer <= 0) {
            game.cancelLobby(lobby);
          }
        }
      });

      game.completeLobbies.forEach((lobby) => {
        if (lobby.stage === 4) {
  
          lobby.channels.forEach((channel) => {
            if (!channel.deleted) {
              
              client.channels.fetch(channel.id).then((discordChnl) => {
                console.log(channel.timer, discordChnl.members.length);
                if (discordChnl.members.array().length > 0) {
                  channel.timer = 600;
                } else {
                  channel.timer -= 1;
                }
  
                if (channel.timer <= 0) {
                  channel.delete(discordChnl);
                }
              });

            }
          });

          lobby.checkChannels();
        }
      });
      
    });
  }
}