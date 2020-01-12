module.exports = function (app) {

    class Chain extends app.MODULE {

        constructor(config) {
            super();
            this.config = config;
            this.debug('info', "loaded module", this.config);
            this.TX = require('./tx')(app);
            this.BLOCK = require('./block')(app);
        }
    }

    return Chain
}