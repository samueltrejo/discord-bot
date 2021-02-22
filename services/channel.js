module.exports = class Channel {
  id;
  timer = 300;
  deleted = false;

  constructor (id) {
    this.id = id;
  }

  delete = (channel) => {
    channel.delete();
  }
}