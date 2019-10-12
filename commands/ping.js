module.exports.run = async (client, message, args) => {
  message.reply('Pong!');
  let output = `== Ping! ==`;
  output += `\u200b\n`;
  output += `\u200b\n== Bazinga! ==\n`;
  output += `\u200b\n== Youza! ==\n`;
  message.channel.send(output, {code: "asciidoc", split: { char: "\u200b" }});
}

module.exports.help = {
  name: 'ping',
}
