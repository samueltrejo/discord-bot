module.exports = class Game {
  activeLobbies = [];
  completeLobbies = [];

  constructor (game, category) {
    this.name = game.category;
    this.info = game;
    this.categoryChannel = category;
  }

  createLobby (author, message) {
    const Lobby = require('./lobby');
    this.activeLobbies.push(new Lobby(author, message));
  }

  getLobby = lobbyId => this.activeLobbies.find(lobby => lobby.id === lobbyId);

  completeLobby = (lobbyId) => {
    const lobby = this.activeLobbies.find(lobby => lobby.id === lobbyId);
    this.activeLobbies = this.activeLobbies.filter(lobby => lobby.id !== lobbyId);
    this.completeLobbies.push(lobby);
  }

  cancelLobby = (lobby) => {
    lobby.cancel();
    this.completeLobby(lobby.id);
  }

  clearLobbies = () => this.completeLobbies = this.completeLobbies.filter(lobby => lobby.stage !== 5);
}