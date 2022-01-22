/// (C) a4004 2022 | https://www.gnu.org/licenses/gpl-3.0.txt

const libowl = require('./lib/libowl');
const discord = require('./lib/libcordapi');

const twitterRelay = require('./plugins/twttr-relay');

function onUncaughtException(error) {
    libowl.log('module'.red, `*** Unhandled exception captured: ${error} ***`, console.warn);
}

process.on('uncaughtException', onUncaughtException);

global.discordClient = new discord.Client( {
    intents: [discord.Intents.FLAGS.DIRECT_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING, 
        discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_BANS, discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        discord.Intents.FLAGS.GUILD_INVITES, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, discord.Intents.FLAGS.GUILD_PRESENCES, discord.Intents.FLAGS.GUILD_SCHEDULED_EVENTS, discord.Intents.FLAGS.GUILD_VOICE_STATES,
        discord.Intents.FLAGS.GUILD_WEBHOOKS
    ]
});

global.discordClient.once('ready', () => {
    libowl.log('main'.green, 'Owl OSS is online.'.bgGreen, console.log);
});

function initModules() {
    twitterRelay.init();
}

function init() {
    libowl.condlog('main'.green, 'Init started.');
    libowl.condlog('main'.cyan, 'Connecting to Discord');

    global.discordClient.login(libowl.appcfg.botToken).then(() => {
        libowl.log('discord'.green, 'Discord client ' + `${libowl.appcfg.botClientId}`.bgBlack.cyan + ' logged in at ' + `${libowl.isostamp()}`.bgBlack.cyan, console.log);
    }).catch((err) => {
        libowl.log('discord'.red, 'Failed to connect to Discord.'.bgRed + ' ' + `${err}`.bgBlack.red, console.error);
    });

    initModules();
}

init();