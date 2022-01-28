const appcfg = require('../cfg/appcfg.json');
const fs = require('fs'); require('colors');

function log(module, message, logfunc) {
    logfunc(`[  ${process.uptime().toFixed(3)}]`.cyan + `  ${module}:` + `\t${message}`);
}

var runcfg = require('../cfg/runcfg.json');
var rcfglck = false;

module.exports = {
    appcfg: appcfg,
    runcfg: runcfg,
    fs: fs,
    isostamp: function () {
        return new Date().toISOString();
    },
    condlog: function (module, message) {
        if (appcfg.logger.verbose) log(module, message, console.log);
    },
    log: log,
    getLockCfg: function() {
        return rcfglck == true;
    },
    setLockCfg: function(value) {
        return rcfglck = value;
    },
    backupRunCfg: function() {
        while(rcfglck);
        this.setLockCfg(true);
        log('config'.cyan, 'Creating backup of runtime configuration'.bgBlue.white, console.log);
        let backup = fs.readFileSync('./cfg/runcfg.json',{encoding:'utf-8'});
        fs.writeFileSync(`./cfg/runcfg.backup-${this.isostamp()}.json`, backup, { encoding: 'utf-8' } );
        this.setLockCfg(false);
    },
    updateRunCfg: function() {
        while(rcfglck);
        this.setLockCfg(true);
        log('config'.cyan, 'Updating runtime configuration'.bgBlue.white, console.log);
        fs.writeFileSync('./cfg/runcfg.json', JSON.stringify(runcfg, null, 4), { encoding: 'utf-8' } );
        runcfg = require('../cfg/runcfg.json');
        this.setLockCfg(false);
    }
};