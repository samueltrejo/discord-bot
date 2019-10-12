module.exports = (client) => {
  if (client.server.queues.length === 0) return;

  client.server.queues.forEach(queue => {
    if (queue.completeLobby && queue.channels.length === 0) {
      client.server.deleteQueue(queue.id);
      return;
    }

    if (queue.channels.length === 0) return;

    queue.channels.forEach(channel => {
      channel.expirationTimer -= 1;
      if (queue.completeLobby && channel.discordChannel.members.size > 0) channel.expirationTimer = 180;
      if (channel.expirationTimer <= 0) queue.deleteChannel(channel.id);
    });
  });
}
