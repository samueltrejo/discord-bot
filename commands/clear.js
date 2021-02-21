module.exports = {
  name: 'clear',
  async execute (client, message, args) {
    if (!message.member.roles.cache.has('632235123680477206')) return;
    await message.channel.messages.fetch({limit: 99})
      .then(messages => message.channel.bulkDelete(messages));
  }
}
