module.exports.run = async (client, message, args) => {
  if (!message.member.roles.has('632235123680477206')) return;

  message.channel.fetchMessages({ limit: 99 })
    .then(messages => message.channel.bulkDelete(messages))
    .catch(console.error);

  // message.channel.fetchMessages()
  //   .then(messages => messages.forEach(message => message.delete()))
  //   .catch(console.error);
}

module.exports.help = {
  name: 'clear',
}
