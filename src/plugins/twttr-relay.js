const libowl = require('../lib/libowl');
const discord = require('../lib/libcordapi');
const express = require('express');
const bodyParser = require('body-parser');

function init() {
    libowl.condlog('twttr'.green, 'Init started.');

    libowl.condlog('twttr'.green, 'Express: bodyParser use JSON');
    app.use(bodyParser.json());
    libowl.condlog('twttr'.green, 'Express: bodyParser use URL encoding (Extended)');
    app.use(bodyParser.urlencoded({extended: true}));

    libowl.condlog('twttr'.green, 'Registering callback for ' + '/ontweet'.bgBlack.cyan + ' API requests using HTTP ' + 'POST'.bgBlack.yellow + ' method.');

    app.all('*', (req, res, next) => {
        if (req.method == 'POST' && req.path == '/ontweet' ) {
            next();
        } else {
            res.status(400);
        }       
    });

    app.post('/ontweet', (req, res) => {
        if (req.headers.authorization === libowl.appcfg.plugins.twitter.apikey) {
            libowl.log('twttr'.green, 'Received authorized API request from'.bgGreen + ' ' + `${req.socket.remoteAddress}`.bgBlack.green, console.log);
            let embed = new discord.MessageEmbed()
                .setColor(libowl.colors.COLOR_YES)
                .setTitle('Owl OSS')
                .setDescription(`${tweet.content}\n\n${tweet.url}`);
            libowl.condlog('twttr'.green, 'Broadcasting Received Tweet'.bgWhite.black);
            libowl.runcfg.plugins.twitter.guilds.forEach(guild => {
                let server = global.discordClient.guilds.cache.get(guild.gid);
                let channel = server.channels.cache.get(guild.cid);
                libowl.condlog('twttr'.green, 'Sending to ' + `${server.name}`.bgBlue + ' in ' + `#${channel.name}`.bgBlack.cyan);
                channel.send( { embeds: [embed] } );
            });
            res.status(200);
            res.json( { status: 200, message: 'OK' } );
        } else {
            libowl.log('twttr'.yellow, 'Received unauthorized API request from'.bgYellow + ' ' + `${req.socket.remoteAddress}`.bgBlack.yellow, console.log);
            res.status(401);
            res.json( { status: 401, message: 'Unauthorized' } );
        }
    });
}

module.exports = {
    init: init
}
