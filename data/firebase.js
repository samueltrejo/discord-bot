module.exports = {
  init () {
    const firebase = require('firebase/app');
    const config = require('./config');
    firebase.initializeApp(config);
  },
  async get (data) {
    let games;
    const firebase = require('firebase');
    await firebase.database().ref(data).once('value', (snapshot) => {
      games = snapshot.val();
    });
    return games;
  }
}