module.exports = {
  name: 'post',
  async execute (client, message, args) {
    const Discord = require('discord.js');
    const embed = new Discord.MessageEmbed()
      .setColor('#5698c4')
      .setTitle('FreeForAll')
      .setDescription(
        `aka 1v1v1v1v1v1v1v1
        7 rounds
        if player scores they go to spectator
        last player to score gets eliminated
        `)
      .addField('*Mutators*', 'match length: unlimited\ndemolish: friendly fire\nboost amount: unlimited\nrespawn time: disable goal reset');

    message.channel.send(embed);
    message.delete();
  }
}

/// welcome
///////////

// const embed = new Discord.MessageEmbed()
// .setColor('#5698c4')
// .setTitle('Welcome to RLArcade')
// .setDescription(`This platform was developed to facilitate finding friends to play unconventional Rocket League mini game modes, like Boomer Mode, 1v4s, Freestyle Only 1v1s, etc.

//   Please read and follow the rules, and check out the info channel for instructions on starting a lobby.

//   Have fun!
  
//   <#617545514509926400> <#617545459195707397>`);


/// info
////////

// const embed = new Discord.MessageEmbed()
// .setColor('#5698c4')
// .setTitle('Getting Started')
// .setDescription(
//   `Follow instruction below to start a lobby.
  
//   1. Go to Rocket League <#616452885970157573> channel and type !lobby.
//   2. Click on a letter emoji to choose a gamemode. [🇦]
//   3. Click on a number emoji to select the lobby size. [1️⃣]
//   4. Click on the check emoji to join the lobby, and click again to leave. [☑️]
//   5. Once all players join the lobby, the voice channels will be created.`)
// .addFields(
//   {name: 'Size Matters', value: 'Only 1 voice channel gets created for 2 player lobbies, otherwise 2 voice channels get created for 3 or more player lobbies.'},
//   {name: 'Channel Cooldown', value: 'Voice channels have a 10 minute cooldown, if there are no players in a voice channel for 10 minutes it will be deleted.'},
// );


// rules
////////

// const embed = new Discord.MessageEmbed()
// .setColor('#5698c4')
// .setTitle('Rules')
// .setDescription(
//   `1. Be respectful, do not harrass, insult or threaten others.
//   2. Racism, sexism, or any kind of hate speech is not allowed.
//   3. Do not spam, post sexual content, or use offensive names.
//   4. Keep discussions in their relevant channels.
//   5. Do not attempt to break or abuse the bot/lobby functionality.
//   6. Do not attempt to spectate or join a lobby without consent.
//   `);

// gamemodes
////////////

// Boomer Mode
// ===========

// # description
// no description

// # mutators
// team size: 3v3
// ball max speed: super fast
// ball bounciness: high
// boost amount: unlimited
// boost strength: 1.5x
// ball physics: super light

// # queue size
// default: 6

// 1v1v1v1v1v1v1v1
// ===============

// # description
// 7 rounds
// if player scores they go to spectator
// last player to score gets eliminated

// # mutators
// team size: 4v4
// match length: unlimited
// demolish: friendly fire
// respawn time: disable goal reset

// # queue size
// default: 8

// 1v4
// ===

// # description
// 5 rounds
// 1 player with unlimited boot vs
// 4 players who are not allowed to use boost

// # mutators
// team size: 4v4
// boost amount: unlimited

// # queue size
// default: 5
// /* queue size is locked at 5 *

// Freestyle Only
// ==============

// # description
// take turns doing freestyle shots

// # mutators
// team size: 1v1
// boost amount: unlimited

// # queue size
// default: 2

// const embed = new Discord.MessageEmbed()
// .setColor('#5698c4')
// .setTitle('Boomer')
// .setDescription(`Super fast ball, super fast cars.`)
// .addField('*Mutators*', 'ball max speed: super fast\nball bounciness: high\nboost amount: unlimited\nboost strength: 1.5x\nball physics: super light');

// const embed = new Discord.MessageEmbed()
// .setColor('#5698c4')
// .setTitle('FreeForAll')
// .setDescription(
//   `aka 1v1v1v1v1v1v1v1
//   7 rounds
//   if player scores they go to spectator
//   last player to score gets eliminated
//   `)
// .addField('*Mutators*', 'match length: unlimited\ndemolish: friendly fire\nboost amount: unlimited\nrespawn time: disable goal reset');
