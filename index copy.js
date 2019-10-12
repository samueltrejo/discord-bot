const { Client, RichEmbed } = require('discord.js');
const bot = new Client();
const token = require('./token.js');
// const token = process.env.token;

let lobbyId = 1;

const prefix = '!';

const lobbyType = {
  standard: 6,
  doubles: 4,
  duel: 2,
  chaos: 8,
}

let playersInQueue = [];

const lobbies = {
  boom: {
    name: 'Boomer Mode',
    lobbyPrefix: 'boom',
    maxPlayers: lobbyType.standard,
    maxPlayersDefault: lobbyType.standard,
    maxPlayersAdjustable: true,
    players: [],
  },
  onev: {
    name: '1v1v1v1v1v1v1v1',
    lobbyPrefix: 'onev',
    maxPlayers: lobbyType.chaos,
    maxPlayersDefault: lobbyType.chaos,
    maxPlayersAdjustable: true,
    players: [],
  },
  onevfour: {
    name: '1v4',
    lobbyPrefix: 'onevfour',
    maxPlayers: 5,
    maxPlayersDefault: 5,
    maxPlayersAdjustable: false,
    players: [],
  },
  boxgolf: {
    name: 'Box Golf',
    lobbyPrefix: 'boxgolf',
    maxPlayers: lobbyType.duel,
    maxPlayersDefault: lobbyType.duel,
    maxPlayersAdjustable: true,
    players: [],
  },
}

const activeLobbies = {}

bot.on('ready', () => {
  console.log('bot online');
});

bot.on('message', msg => {
  let args = msg.content.substring(prefix.length).split(' ');
  const member = msg.author.username;
  const gameMode = msg.channel.topic;
  const category = msg.channel.parent.name;
  if (category !== 'Game Modes') return;
  
  switch (args[0]) {
    case 'q':
      // if (playersInQueue.includes(member)) return;

      if (lobbies[gameMode].players.length === 0 && lobbies[gameMode].maxPlayersAdjustable && args[1] && lobbyType[args[1]]) {
        lobbies[gameMode].maxPlayers = lobbyType[args[1]];
      }

      lobbies[gameMode].players.push(member);
      playersInQueue.push(member);

      const queueInfoEmbed = new RichEmbed()
        .setAuthor(`${lobbies[gameMode].name}`, 'https://i.imgur.com/radG4jv.png')
        .addField('Type !q to join the lobby.', `${msg.author.username} has joined.`)
        .setFooter(lobbies[gameMode].players.length === 1 ? ('There is 1 player in the queue.') : (`There are ${lobbies[gameMode].players.length} players in the queue.`));
      msg.channel.send(queueInfoEmbed);

      if (lobbies[gameMode].players.length === lobbies[gameMode].maxPlayers) {
        players = lobbies[gameMode].players;
        lobbies[gameMode].players = [];

        let playersInQueueCopy = playersInQueue;
        players.forEach((player) => {
          playersInQueueCopy = playersInQueueCopy.filter(playerCopy => playerCopy !== player);
        })
        playersInQueue = playersInQueueCopy;

        lobbies[gameMode].maxPlayers = lobbies[gameMode].maxPlayersDefault;

        const lobbyCreatedEmbed = new RichEmbed()
          .setAuthor(`${lobbies[gameMode].name}`, 'https://i.imgur.com/radG4jv.png')
          .addField('The lobby has been created.', `Please join the channel ${lobbies[gameMode].lobbyPrefix}${lobbyId} within 10 minutes.`)
          .addField(`${players}`, 'See the mode settings channel to get settings.');
        msg.channel.send(lobbyCreatedEmbed);

        const server = msg.guild;
        const lobbyName = `${lobbies[gameMode].lobbyPrefix}${lobbyId}`;
        lobbyId += 1;

        const activeLobby = {
          gameMode: gameMode,
          name: lobbyName,
          lobbyTimer: 600,
          allPlayersPresent: false,
          maxPlayers: lobbies[gameMode].maxPlayers,
          teamChannel: false,
        }
        activeLobbies[lobbyName] = activeLobby;
        lobbyTimerIntervalSet(lobbyName);

        server.createChannel(lobbyName, { type: 'voice' }).then(channel => {
          let lobbyCategory = server.channels.find(c => c.name == lobbies[gameMode].name && c.type == 'category');
          channel.setParent(lobbyCategory.id);
        }).catch(console.error);
      }
      break;
    case 'leave':
      if (lobbies[gameMode].players.includes(member)) {
        players = lobbies[gameMode].players.filter(player => player !== member);
        lobbies[gameMode].players = players;

        allPlayers = playersInQueue.filter(player => player !== member);
        playersInQueue = allPlayers;

        const embed = new RichEmbed()
          .setAuthor(`${lobbies[gameMode].name}`, 'https://i.imgur.com/radG4jv.png')
          .setDescription(`${msg.author.username} has left.`)
          .setFooter(lobbies[gameMode].players.length === 1 ? ('There is 1 player in the queue.') : (`There are ${lobbies[gameMode].players.length} players in the queue.`));
        msg.channel.send(embed);
      }
      break;
    case 'clear':
      msg.channel.fetchMessages({ limit: 99 })
        .then(messages => msg.channel.bulkDelete(messages))
        .catch(console.error);
      break;
  }
});

const lobbyTimerIntervalSet = (lobby) => {
  activeLobbies[lobby].lobbyTimerInterval = setInterval(() => {
    if (activeLobbies[lobby].lobbyTimer <= 0) {
      const lobbyChannel = bot.channels.find(c => c.name == activeLobbies[lobby].name && c.type == 'voice');
      const lobbyChatChannel = bot.channels.find(c => c.topic == activeLobbies[lobby].gameMode && c.type == 'text')

      if (lobbyChannel) lobbyChannel.delete();
      clearInterval(activeLobbies[lobby].lobbyTimerInterval);

      const cancelEmbed = new RichEmbed()
        .setAuthor(`${activeLobbies[lobby].name}`, 'https://i.imgur.com/radG4jv.png')
        .setDescription('The lobby has been cancelled because not all players joined.');

      lobbyChatChannel.send(cancelEmbed);

    } else {
      activeLobbies[lobby].lobbyTimer -= 1;
    }

    // console.error(activeLobbies[lobby].lobbyTimer);
  }, 1000)
}

bot.on('voiceStateUpdate', (previousState, newState) => {
  const oldChannel = previousState.voiceChannel;
  const newChannel = newState.voiceChannel;

  if (oldChannel) {
    const category = oldChannel.parent.name;
    if (category == 'General') return;

    const lobbyName = oldChannel.name;
    if (activeLobbies[lobbyName].allPlayersPresent) {
      if (oldChannel.members.size < 1) {
        oldChannel.delete();
      }
    }
  }

  if (newChannel) {
    const category = newChannel.parent.name;
    if (category == 'General') return;

    const lobbyName = newChannel.name;
    if (!activeLobbies[lobbyName].allPlayersPresent) {
      if (newChannel.members.size >= activeLobbies[lobbyName].maxPlayers - 1) {
        clearInterval(activeLobbies[lobbyName].lobbyTimerInterval);
        activeLobbies[lobbyName].allPlayersPresent = true;
        activeLobbies[lobbyName].lobbyTimer = 15;

        if (!activeLobbies[lobbyName].teamChannel) {
          const server = newChannel.guild;
          const team1ChannelName = `${lobbyName} team 1`;
          const team2ChannelName = `${lobbyName} team 2`;
    
          const teamLobby1 = {
            name: team1ChannelName,
            lobbyTimer: 180,
            allPlayersPresent: false,
            maxPlayers: 1,
            teamChannel: true,
          }
    
          const teamLobby2 = {
            name: team2ChannelName,
            lobbyTimer: 180,
            allPlayersPresent: false,
            maxPlayers: 1,
            teamChannel: true,
          }
    
          activeLobbies[team1ChannelName] = teamLobby1;
          activeLobbies[team2ChannelName] = teamLobby2;
          lobbyTimerIntervalSet(team1ChannelName);
          lobbyTimerIntervalSet(team2ChannelName);
    
          server.createChannel(team1ChannelName, { type: 'voice' }).then(channel => {
            channel.setParent(newChannel.parent.id);
          }).catch(console.error);
    
          server.createChannel(team2ChannelName, { type: 'voice' }).then(channel => {
            channel.setParent(newChannel.parent.id);
          }).catch(console.error);
        }
      }
    }
  }
});

bot.login(token);
