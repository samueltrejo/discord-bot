const Discord = require('discord.js');
const { Client, RichEmbed } = require('discord.js');
const client = new Client();
const token = require('./token.json').val;
const fs = require('fs');

client.commands = new Discord.Collection();

fs.readdir('./commands', (error, files) => {
  if (error) console.error(error);

  let jsfiles = files.filter(f => f.split('.').pop() === 'js');
  if (jsfiles.length <= 0) {
    console.error('no commands to load');
    return;
  }

  console.log(`loading ${jsfiles.length} commands`);

  jsfiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${i + 1}: ${f} loaded`);
    btoa.commands.set(f, props);
  });
});

bot.on('ready', () => {
  console.log('bot online');
});
