/// (C) a4004 2022 | https://www.gnu.org/licenses/gpl-3.0.txt

const libowl = require('./lib/libowl');
const discord = require('./lib/libcordapi');

global.discordClient = new discord.Client( {
    intents: [discord.Intents.FLAGS.DIRECT_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING, 
        discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_BANS, discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        discord.Intents.FLAGS.GUILD_INVITES, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, discord.Intents.FLAGS.GUILD_PRESENCES, discord.Intents.FLAGS.GUILD_SCHEDULED_EVENTS, discord.Intents.FLAGS.GUILD_VOICE_STATES,
        discord.Intents.FLAGS.GUILD_WEBHOOKS
    ]
});