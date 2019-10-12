module.exports.run = async (client, memberPast, memberNow) => {
  if (memberNow.voiceChannel) {
    const channel = memberNow.voiceChannel;
    const queue = client.server.getQueue(memberNow.voiceChannel.name);

    if (channel.parent.name == 'General' || !queue || queue.completeLobby) return;

    if (memberNow.voiceChannel.members.size >= queue.size) {
      queue.createTeamChannels();
      queue.completeLobby = true;
    }
    
  }
}

module.exports.help = {
  name: 'voiceStateUpdate',
}
