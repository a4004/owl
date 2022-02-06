const appcfg = require('../cfg/appcfg.json');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { getYesNo } = require('cli-interact');

const rest = new REST({ version: '9' }).setToken(appcfg.botToken);

/*
rest.get(Routes.applicationGuildCommands(appcfg.botClientId, 'xxxxxxxxxxxxxxxx')).then(data => {
    const promises = [];
    for (const command of data) {
        if (getYesNo(`Delete command: ${command.name} with ID: ${command.id} ?`)) {
            const deleteUrl = `${Routes.applicationGuildCommands(appcfg.botClientId, 'xxxxxxxxxxxxxxxx')}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }
    }
    console.log('Command completed successfully.');
    return Promise.all(promises);
}).catch(err => {
    console.error(err);
});
*/

rest.get(Routes.applicationCommands(appcfg.botClientId)).then(data => {
    const promises = [];
    for (const command of data) {
        if (getYesNo(`Delete command: ${command.name} with ID: ${command.id} ?`)) {
            const deleteUrl = `${Routes.applicationCommands(appcfg.botClientId)}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }
    }
    console.log('Command completed successfully.');
    return Promise.all(promises);
}).catch(err => {
    console.error(err);
});