const debug_mode      = false;
const color_interact  = '#00ffaa';
const color_secondary = '#00aaff';
const color_win       = '#eeee00';
const color_negative  = '#ff00ff';
const color_positive  = '#00ff00';
const color_default   = '#ffffff';
const color_error     = '#ff0000';

const libowl = require('../lib/libowl');
const discord = require('../lib/libcordapi');
const libtime = require('../lib/libtime');
const nooncfg = libowl.runcfg.plugins.noon;

function toOrdinalSuffix(num) {
    const int = parseInt(num),
        digits = [int % 10, int % 100],
        ordinals = ['st', 'nd', 'rd', 'th'],
        oPattern = [1, 2, 3, 4],
        tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19];
    return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
        ? int + ordinals[digits[0] - 1]
        : int + ordinals[3];
};

function sortDesc(obj, key) {
    obj.sort(function(a, b) {
        return (b[key] > a[key]) ? 1 : ((b[key] < a[key]) ? -1 : 0);
    });
}

function replyEmbed(color, title, message) {
    return new discord.MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(message)
        .setTimestamp()
        .setFooter({text:'Owl OSS'});
}

function resetTimeout(gid) {
    nooncfg.guilds.forEach(guild => {
        if (guild.gid != gid) {
            return;
        } else {
            guild.bucket.server_timeout = false;
            updateRunCfg();
        }
    })
}

function updateRunCfg() {
    libowl.backupRunCfg();
    libowl.updateRunCfg();
}

function init() {
    libowl.condlog('noon'.green, 'Init started.');
    libowl.condlog('noon'.green, 'Creating message event handler.');

    let discordClient = global.discordClient;

    discordClient.on('messageCreate', async (message) => {
        try 
        {
            if (message.author.id != discordClient.user.id) {
                nooncfg.guilds.forEach(async (guild) => {
                    if (guild.gid != message.guild.id) {
                        return;
                    } else {
                        let current_time = libtime.getLondonTime(message.createdAt);
                        if ((current_time.getHours() != 0 || current_time.getMinutes() != 0) && debug_mode == false) {
                            return;
                        } else {
                            if (guild.bucket.server_timeout) {
                                discordClient.users.fetch(guild.bucket.last_winner).then(async (winner) => {
                                    if (message.content.includes('00:00') && message.author.id != guild.bucket.last_winner) {
                                        await message.reply({ embeds: [replyEmbed(color_negative, 
                                            ':snail: You were too slow!', 
                                            `**${winner.username}** got 00:00 before you. Better luck next time.`)]
                                        });
                                    }
                                });  
                                setTimeout(() => {
                                    libowl.condlog('noon'.cyan, 'Clearing timeout for ' + `${guild.gid}`.bgBlack);
                                    resetTimeout(guild.gid);
                                }, 3600000);               
                            } else {
                                let user = guild.bucket.users.find(u => u.uid == message.author.id);
                                if (user == undefined) {
                                    libowl.condlog('noon'.cyan, 'Setting winner & timeout for ' + `${guild.gid}`.bgBlack);
                                    guild.bucket.server_timeout = true;
                                    guild.bucket.last_winner = message.author.id;
                                    await message.reply({ embeds: [replyEmbed(color_win,
                                        `:trophy: Congrats ${message.author.username}, you win!`,
                                        'Your balance has been updated, thanks for playing Noon. Good night!')]
                                    });
                                    libowl.condlog('noon'.green, 'Adding new user ' + `${message.author.id}`.bgBlack);
                                    guild.bucket.users.push({
                                        uid: message.author.id,
                                        cooldown: 0,
                                        balance: 1,
                                        history: [current_time.toISOString()]
                                    });
                                } else {
                                    if (user.cooldown > 0 && message.content.includes('00:00')) {
                                        await message.reply({ embeds: [replyEmbed(color_negative,
                                            ':x: You\'ve been disqualified!',
                                            `You cannot be awarded because you have a ${user.cooldown} night timeout.`)]
                                        });
                                    } else {
                                        libowl.condlog('noon'.cyan, 'Setting winner & timeout for ' + `${guild.gid}`.bgBlack);
                                        guild.bucket.server_timeout = true;
                                        guild.bucket.last_winner = message.author.id;
                                        await message.reply({ embeds: [replyEmbed(color_win,
                                            `:trophy: Congrats ${message.author.username}, you win!`,
                                            'Your balance has been updated, thanks for playing Noon. Good night!')]
                                        });
                                        libowl.condlog('noon'.green, 'Updating existing user ' + `${user.uid}`.bgBlack);
                                        user.balance = user.balance + 1;
                                        user.history.push(current_time.toISOString());
                                    }
                                }
                                setTimeout(() => {
                                    libowl.condlog('noon'.cyan, 'Clearing timeout for ' + `${guild.gid}`.bgBlack);
                                    resetTimeout(guild.gid);
                                }, 120000);      
                                console.log(JSON.stringify(libowl.runcfg));
                                updateRunCfg();
                            }
                        }
                    }
                });
            }
        }
        catch (err) {
            libowl.log('noon', 'An error was encountered. ' + `${err}`.bgRed, console.error);
        }
    });

    discordClient.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) {
            return;
        } else {
            try 
            {
                const { commandName } = interaction;
                switch (commandName) 
                {
                    case 'ping': 
                        await interaction.reply({embeds: [replyEmbed(color_interact,
                            'Owl OSS',
                            `:globe_with_meridians: Discord API Response Time **${discordClient.ws.ping}ms**`)]
                        });
                        break;
                    case 'mynoons':
                        let result = nooncfg.guilds.find(guild => guild.gid == interaction.guild.id).bucket.users.find(
                            user => user.uid == interaction.user.id);
                        if (result == undefined) {
                            await interaction.reply({embeds: [replyEmbed(color_interact,
                                ':mag_right: We couldn\'t find your record.',
                                'That means you have a balance of **0**, no timeouts and no previous wins.')]
                            });
                        } else {
                            let embed = new discord.MessageEmbed()
                                .setColor(color_interact)
                                .setTitle(`:open_file_folder: Record for **${interaction.user.username}**`)
                                .setTimestamp()
                                .setFooter({text:'Owl OSS'});
                            let last_time = result.history.slice(-1);
                            let sorted = nooncfg.guilds.find(guild => guild.gid == interaction.guild.id).bucket.users;
                            sortDesc(sorted, 'balance');
                            let position = sorted.findIndex(user => user.uid == interaction.user.id) + 1;
                            if (position == 1) {
                                embed.addField('Rank:', ':first_place:');
                            } else if (position == 2) {
                                embed.addField('Rank:', ':second_place:');
                            } else if (position == 3) {
                                embed.addField('Rank:', ':third_place:');
                            } else {
                                embed.addField('Rank:', `**${toOrdinalSuffix(position)}**`);
                            }
                            embed.addFields(
                                { name: 'Balance:', value: `\`${result.balance}\`` },
                                { name: 'Last Win:', value: `\`${last_time}\`` }
                            );
                            await interaction.reply({embeds: [embed]});
                        }
                        break;
                    case 'leaderboard':
                        let results = nooncfg.guilds.find(guild => guild.gid == interaction.guild.id).bucket;
                        if (results == undefined || results.users.length < 1) {
                            await interaction.reply({embeds: [replyEmbed(color_interact,
                                ':mag_right: We couldn\'t find a record for this server.',
                                'This could be due to an internal error or lack of previous interaction.')]
                            });
                        } else {
                            let embed = new discord.MessageEmbed()
                                .setColor(color_interact)
                                .setTitle(`:open_file_folder: ${interaction.guild.name} Leaderboard`)
                                .setTimestamp()
                                .setFooter({text:'Owl OSS'});
                            await discordClient.users.fetch(results.last_winner).then(winner => {
                                embed.setDescription(`Last winner was **${winner.username}**.`);
                            }).catch(err => {
                                libowl.condlog('noon'.red, 'Could not get last winner. ' + `${err}`.bgRed);
                            });
                            let result = results.users.slice();
                            sortDesc(result, 'balance');
                            let position = 1;
                            let appendData = new Promise((resolve) => {
                                result.forEach(async data => {
                                    try {
                                        if (data.uid == discordClient.user.id) {
                                            return;
                                        } else {
                                            let username = (await discordClient.users.fetch(data.uid)).username;
                                            let last_win = data.history.slice(-1);
            
                                            if (position == 1) {
                                                embed.addField(`:first_place: ${username}`,` • Balance: \`${data.balance}\`\n • Last Win: \`${last_win}\``);
                                            } else if (position == 2) {
                                                embed.addField(`:second_place: ${username}`,` • Balance: \`${data.balance}\`\n • Last Win: \`${last_win}\``);
                                            } else if (position == 3) {
                                                embed.addField(`:third_place: ${username}`,` • Balance: \`${data.balance}\`\n • Last Win: \`${last_win}\``);
                                            } else if (position == 4 || position == 5) {
                                                embed.addField(`:medal: ${username}`,` • Balance: \`${data.balance}\`\n • Last Win: \`${last_win}\``);
                                            } else {
                                                embed.addField(`${username}`,` • Balance: \`${data.balance}\`\n • Last Win: \`${last_win}\``);
                                            }
            
                                            libowl.condlog('noon'.green, 'Added field for ' + `${data.uid}`.bgBlack.green);
                                        }
                                    } catch {
                                        libowl.condlog('noon'.yellow, 'Failed to add user to leaderboard. ' + `${data.uid}`.bgBlack.yellow);
                                    }
                                    position += 1;                      
                                });
                                resolve();
                            });
                            appendData.then(async () => {
                                await interaction.reply({embeds: [embed]});
                            });
                        }
                        break;
                    case 'dispute':
                        let guild = nooncfg.guilds.find(guild => guild.gid == interaction.guild.id).bucket;
                        if (guild == undefined || guild.dispute_lock) {
                            await interaction.reply({embeds: [replyEmbed(color_secondary,
                                ':warning: You can\'t start a dispute!',
                                'Another dispute might be in progress and/or this server does not have this feature enabled.')]
                            });
                        } else {
                            let claimant = interaction.user;
                            let defendant = guild.last_winner;
                            try {
                                defendant = await discordClient.users.fetch(defendant);
                            } catch {
                                await interaction.reply({embeds: [replyEmbed(color_negative,
                                    ':warning: You can\'t start a dispute!',
                                    'There is no previous winner to dispute.')]
                                });
                                return;
                            }
                            if (claimant.id == defendant.id && debug_mode == false) {
                                await interaction.reply({embeds: [replyEmbed(color_negative,
                                    ':warning: You can\'t start a dispute!',
                                    'You can\'t start a dispute with yourself. That\'s just silly.')]
                                }); 
                            } else {
                                guild.dispute_lock = true;
                                await interaction.reply({embeds: [replyEmbed(color_positive,
                                    `:robot: Started dispute between **${claimant.username}** and **${defendant.username}**.`, 
                                    'Await further instructions below.')]
                                });
                                let embed = new discord.MessageEmbed() 
                                    .setColor(color_interact)
                                    .setTitle(`:man_judge: A dispute commences between **${claimant.username}** and **${defendant.username}**!`)
                                    .setDescription('Vote now, in the next **60 seconds** to reach a final verdict!')
                                    .setTimestamp()
                                    .setFooter({text:'Owl OSS'})
                                    .addFields(
                                        { name: ':crossed_swords: Dispute', value: `A vote in favour of ${claimant.username}.` },
                                        { name: ':shield: Defend', value: `A vote in favour of ${defendant.username}.` }
                                    );
                                await interaction.channel.send({embeds: [embed]}).then(async message => {
                                    await message.react('⚔️');
                                    await message.react('🛡️');

                                    setTimeout(async () => {
                                        message.channel.send({embeds: [replyEmbed(color_interact,
                                            ':clock1230: **The clock is ticking!**', ':three::zero: seconds left!')]});
                                    }, 30000);
                                    setTimeout(async () => {
                                        message.channel.send({embeds: [replyEmbed(color_interact,
                                            ':one::zero: **seconds left!**', 'Vote now if you haven\'t already!')]});
                                    }, 50000);
                                    setTimeout(async () => {
                                        message.channel.send({embeds: [replyEmbed(color_interact,
                                            '::drum: **Vote closing!**', 'Results will be displayed now. :arrow_down:')]});
                                    }, 59000);
                                    setTimeout(async () => {
                                        guild.dispute_lock = false;
                                        const claim = message.reactions.cache.get('⚔️').count - 1;
                                        const defend = message.reactions.cache.get('🛡️').count - 1;
                                        let embed = new discord.MessageEmbed() 
                                            .setTimestamp()
                                            .setFooter({text:'Owl OSS'})
                                            .addFields(
                                                { name: `:crossed_swords: Votes in favour of **${claimant.username}**:`, value: `${claim}` },
                                                { name: `:shield: Votes in favour of **${defendant.username}**:`, value: `${defend}` }
                                            );
                                        if (claim > defend) {
                                            embed.setColor(color_positive);
                                            embed.setTitle(`:crossed_swords: **${claimant.username}** has won the dispute!`);;
                                            embed.setDescription(`The defendant, ${defendant.username} will have their balance deducted and be barred from playing for the next 3 nights.`);
                                            let user = guild.users.find(u => u.uid == defendant.id);
                                            if (user == undefined) {
                                                guild.users.push({
                                                    uid: defendant.id,
                                                    cooldown: 3,
                                                    balance: -1,
                                                    history: ['Unavailable (Convicted of fraud)']
                                                });
                                            } else {
                                                user.cooldown = 3;
                                                user.balance = user.balance - 1;
                                                user.history.push('Unavailable (Convicted of fraud)');
                                            }                      
                                        } else if (claim < defend) {
                                            embed.setColor(color_negative);
                                            embed.setTitle(`:shield: **${claimant.username}** has lost the dispute!`);;
                                            embed.setDescription(`The claimant will be barred from playing for the next 3 nights. The defendant, ${defendant.username}, will be compensated.`);
                                            let user = guild.users.find(u => u.uid == claimant.id);
                                            if (user == undefined) {
                                                guild.users.push({
                                                    uid: claimant.id,
                                                    cooldown: 3,
                                                    balance: 0,
                                                    history: ['Unavailable (Lost dispute)']
                                                });
                                            } else {
                                                user.cooldown = 3;
                                                user.history.push('Unavailable (Lost dispute)');
                                            }   
                                        } else {
                                            embed.setColor(color_default);
                                            embed.setTitle(`:game_die: The verdict could not be decided.`);;
                                            embed.setDescription('All participants will be barred from playing for the next night.');

                                            message.reactions.cache.get('⚔️').users.cache.forEach(voter => {
                                                let user = guild.users.find(u => u.uid == voter.id);
                                                if (user == undefined) {
                                                    guild.users.push({
                                                        uid: voter.id,
                                                        cooldown: 3,
                                                        balance: 0,
                                                        history: ['Unavailable (Failed dispute)']
                                                    });
                                                } else {
                                                    user.cooldown = 3;
                                                    user.history.push('Unavailable (Failed dispute)');
                                                }   
                                            });
                                            message.reactions.cache.get('🛡️').users.cache.forEach(voter => {
                                                let user = guild.users.find(u => u.uid == voter.id);
                                                if (user == undefined) {
                                                    guild.users.push({
                                                        uid: voter.id,
                                                        cooldown: 3,
                                                        balance: 0,
                                                        history: ['Unavailable (Failed dispute)']
                                                    });
                                                } else {
                                                    user.cooldown = 3;
                                                    user.history.push('Unavailable (Failed dispute)');
                                                }   
                                            });

                                        }
                                        await message.channel.send({embeds:[embed]});
                                        guild.last_winner = '';
                                        updateRunCfg();
                                    }, 60000);
                                });
                            }
                        }
                        break;
                }
            }
            catch (err) {
                libowl.log('noon', 'An error was encountered. ' + `${err}`.bgRed, console.error);
                await interaction.reply({embeds:[replyEmbed(color_error, ':robot: Uh-oh!', 
                    'My internal wirings went bust and I could not complete the command. If the issue remains, ' 
                        + 'please contact the administrator to resolve the problem.')]
                });
            }
        }
    });

    setInterval(() => {
        nooncfg.guilds.forEach(guild => {
            guild.bucket.users.forEach(user => {
                if (user.cooldown > 0) {
                    libowl.condlog('noon'.green, 'Reducing cooldown for ' + `${user.uid}`.bgBlack + ' in ' + `${guild.gid}`.bgBlack);
                    user.cooldown = user.cooldown - 1;
                    updateRunCfg();
                }
            })
        });
    }, 86400000);
}

module.exports = {
    init: init
}
