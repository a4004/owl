const appcfg = require('../cfg/appcfg.json');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Ping command.'),
	new SlashCommandBuilder().setName('mynoons').setDescription('Displays Noon balance.'),
	new SlashCommandBuilder().setName('leaderboard').setDescription('Displays Noon leaderboard.'),
    new SlashCommandBuilder().setName('dispute').setDescription('Starts a dispute with the last winner.')
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(appcfg.botToken);

rest.put(Routes.applicationCommands(appcfg.botClientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);