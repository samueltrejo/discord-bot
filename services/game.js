module.exports = class Game {
  activeLobbies = [];
  completeLobbies = [];

  constructor (game, category) {
    this.name = game.category;
    this.info = game;
    this.categoryChannel = category;
  }

  createLobby (author, messageId) {
    const Lobby = require('./lobby');
    this.activeLobbies.push(new Lobby(author, messageId));
  }

  getLobby = lobbyId => this.activeLobbies.find(lobby => lobby.id === lobbyId);

  completeLobby = (lobbyId) => {
    this.completeLobbies = this.activeLobbies.filter((lobby) => lobby.id === lobbyId);
    this.activeLobbies = this.activeLobbies.filter((lobby) => lobby.id !== lobbyId);
  }

  clearLobbies = () => this.completeLobbies = this.completeLobbies.filter(lobby => lobby.stage !== 5);
}