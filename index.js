const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

client.commands = new Discord.Collection();
client.config = require('./config.js');

// COMMANDS //
fs.readdir('./commands', (error, files) => {
  if (error) console.error(error);

  let commandFiles = files.filter(filename => filename.split('.').pop() === 'js');
  if (commandFiles.length <= 0) {
    console.error('no commands to load');
    return;
  }

  console.log(`loading ${commandFiles.length} commands`);

  commandFiles.forEach((commandName, i) => {
    let props = require(`./commands/${commandName}`);
    console.log(`${i + 1}: ${commandName} loaded`);
    client.commands.set(props.help.name, props);
  });
});

// EVENTS //
fs.readdir('./events', (error, files) => {
  if (error) console.error(error);

  let eventFiles = files.filter(filename => filename.split('.').pop() === 'js');
  if (eventFiles.length <= 0) {
    console.error('no events to load');
    return;
  }

  console.log(`loading ${eventFiles.length} events`);

  eventFiles.forEach((eventName, i) => {
    let props = require(`./events/${eventName}`);
    console.log(`${i + 1}: ${eventName} loaded`);
    client.on(props.help.name, props.run.bind(null, client));
  });
});

client.login(client.config.token);
