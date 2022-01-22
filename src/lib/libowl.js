const appcfg = require(process.argv.at(0));
const runcfg = require(process.argv.at(1));
const fs = require('fs');

function log(module, message, logfunc) {
    logfunc(`[  ${process.uptime().toFixed(3)}]`.cyan + `  ${module}:` + `\t${message}`);
}

module.exports = {
    appcfg: appcfg,
    runcfg: runcfg,
    fs: fs,
    isostamp: function () {
        return new Date().toISOString();
    },
    condlog: function (module, message) {
        if (applicationCfg.additionalCfg.verbose) log(module, message, console.log);
    },
    log: log,
    backupRunCfg: function() {
        log('config'.cyan, 'Creating backup of runtime configuration'.bgBlue.white, console.log);
        fs.writeFileSync(`${process.argv.at(1)}.backup-${this.isostamp()}`, JSON.stringify(runcfg, null, 4), { encoding: 'utf-8' } );
    },
    updateRunCfg: function() {
        log('config'.cyan, 'Updating runtime configuration'.bgBlue.white, console.log);
        fs.writeFileSync(`${process.argv.at(1)}.backup-${this.isostamp()}`, JSON.stringify(runcfg, null, 4), { encoding: 'utf-8' } );
    }
};