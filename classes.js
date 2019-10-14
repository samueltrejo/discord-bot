class Server {
  constructor(client) {
    this.lobbyTypes = {
      standard: 6,
      doubles: 4,
      duel: 2,
      chaos: 8,
      custom1: 3,
      custom2: 5,
      cusotm3: 7
    };
    this.gamemodes = {
      boom: {
        gamemode: 'Boomer Mode',
        sizeName: 'standard',
        defaultSize: 6,
        strictSize: false,
      },
      onev: {
        gamemode: '1v1v1v1v1v1v1v1',
        sizeName: 'chaos',
        defaultSize: 8,
        strictSize: false,
      },
      onevfour: {
        gamemode: '1v4',
        sizeName: 'custom2',
        defaultSize: 5,
        strictSize: true,
      },
      freestyle: {
        gamemode: 'Freestyle Only',
        sizeName: 'duel',
        defaultSize: 2,
        strictSize: false,
      }
    }
    this.globalCounter = 1000;
    this.playersQueued = [];
    this.guild = client.guilds.find(guild => guild.id == '536395956896137256');
    this.queues = [];
    this.grabId = () => {
      const id = this.globalCounter;
      this.globalCounter += 1;
      return id;
    }
    this.filterPlayersQueued = (players) => {
      const filteredPlayersQueued = this.playersQueued.filter(playerQueued => !players.includes(playerQueued));
      this.playersQueued = filteredPlayersQueued;
    }
    this.createQueue = (type) => {
      let queue = this.queues.find(queue => queue.type == type && queue.lobbyCreated === false);

      if (queue) return queue;

      const id = this.grabId();
      const name = `${type.replace(/^\w/, c => c.toUpperCase())}${id}`;
      const gamemode = this.gamemodes[type].gamemode;
      const category = this.guild.channels.find(channel => channel.name == gamemode && channel.type == 'category');
      const sizeId = this.gamemodes[type].sizeName;
      const size = this.lobbyTypes[sizeId];
      const defaultSize = this.lobbyTypes[sizeId];
      const strictSize = this.gamemodes[type].strictSize;
      const teamChannel = false;
      const guild = this.guild;
      const filterPlayersQueued = this.filterPlayersQueued;
      
      queue = new Queue(id, name, gamemode, category, type, sizeId, size, defaultSize, strictSize, teamChannel, guild, filterPlayersQueued);
      this.queues.push(queue)
      return queue;
    }
    this.getQueue = name => this.queues.find(queue => queue.name == name);
    this.getUncompleteQueueByType = type => this.queues.find(queue => queue.type == type && queue.lobbyCreated === false);
    this.deleteQueue = id => {
      const queue = this.queues.find(queue => queue.id == id);
      this.filterPlayersQueued(queue.players);
      this.queues = this.queues.filter(queue => queue.id !== id);
    }
  }
}

class Queue {
  constructor(id, name, gamemode, category, type, sizeId, size, defaultSize, strictSize, teamChannel, guild, filterPlayersQueued) {
    this.id = id;
    this.name = name;
    this.channels = [];
    this.gamemode = gamemode;
    this.category = category;
    this.type = type;
    this.sizeId = sizeId;
    this.size = size;
    this.defaultSize = defaultSize;
    this.strictSize = strictSize;
    this.players = [];
    this.completeLobby = false;
    this.lobbyCreated = false;
    this.teamChannel = teamChannel;
    this.guild = guild;
    this.expirationTimer;
    this.removePlayer = player => {
      this.players = this.players.filter(player => player != player);
      filterPlayersQueued([player]);
    }
    this.createLobbyChannel = () => {
      this.lobbyCreated = true;
      this.guild.createChannel(this.name, { type: 'voice' })
        .then(channel => {
          channel.setParent(this.category);
          const id = 'lobby';
          const name = `${this.name} Lobby`;
          const queueId = this.id;
          const expirationTimer = 600;
          const discordChannel = channel;
          const lobbyChannel = new Channel(id, name, queueId, expirationTimer, discordChannel);
          this.channels.push(lobbyChannel);
        })
        .catch(console.error);
    }
    this.createTeamChannels = () => {
      this.guild.createChannel(`${this.name} Team 1`, { type: 'voice' })
        .then(channel => {
          channel.setParent(this.category);
          const id = 'team1';
          const name = `${this.name} Team 1`;
          const queueId = this.id;
          const expirationTimer = 300;
          const discordChannel = channel;
          const lobbyChannel = new Channel(id, name, queueId, expirationTimer, discordChannel);
          this.channels.push(lobbyChannel);
        })
        .catch(console.error);

      this.guild.createChannel(`${this.name} Team 2`, { type: 'voice' })
        .then(channel => {
          channel.setParent(this.category);
          const id = 'team2';
          const name = `${this.name} Team 2`;
          const queueId = this.id;
          const expirationTimer = 300;
          const discordChannel = channel;
          const lobbyChannel = new Channel(id, name, queueId, expirationTimer, discordChannel);
          this.channels.push(lobbyChannel);
        })
        .catch(console.error);

        filterPlayersQueued(this.players);
    }
    this.deleteChannel = (id) => {
      const channelToDelete = this.channels.find(channel => channel.id === id);
      const filteredChannels = this.channels.filter(channel => channel.id !== id);
      this.channels = filteredChannels;
      channelToDelete.discordChannel.delete();
    }
    this.getChannel = (id) => this.channels.find(channel => channel.id == id);
  }
}

class Channel {
  constructor(id, name, queueId, expirationTimer, discordChannel) {
    this.id = id;
    this.name = name;
    this.queueId = queueId;
    this.expirationTimer = expirationTimer;
    this.discordChannel = discordChannel;
    this.isRemoved = false;
  }
}

module.exports = Server;

//QUEUE
// this.id = 1003
// this.name = Boom1003
// this.gamemode = Boomer Mode
// this.type = boom
// this.sizeId = standard
// this.size = int
// this.defaultSize
// this.strictSize
// this.players
// this.expirationTimer
// this.completeLobby
// this.teamChannel