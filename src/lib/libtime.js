const libowl = require('../lib/libowl');
const moment = require('moment-timezone');

module.exports = {
    getTimeZone: function(time, zone) {
        let z_time = new Date(moment(time.toISOString()).tz(zone).toISOString());
        libowl.condlog('libtime'.cyan, 'Converting Time ' + time.toISOString().bgBlack + ' to ' + `${zone}`.bgBlack.cyan + ' ' + z_time.toISOString().bgBlack.green);
        return z_time;
    },
    getLondonTimeNow: function() {
        return this.getLondonTime(new Date(Date.now()));
    },
    getLondonTime: function(time) {
        return this.getTimeZone(time, 'Europe/London');
    }
}