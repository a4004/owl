const libowl = require('../lib/libowl');

// REMOVED TIMEZONE CONVERSIONS AS THEY'RE REDUNDANT, KEEPING USE OF FUNCTIONS FOR COMPATIBILITY WITH SOURCE CODE.
module.exports = {
    getLondonTimeNow: function() {
        return this.getLondonTime(new Date(Date.now()));
    },
    getLondonTime: function(time) {
        return time;
    }
}
