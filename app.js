const EventEmitter = require('events');
const fs = require('fs');
const appError = require('./app/error').createAppError;

class App extends EventEmitter {

    constructor(file) {
        super();

        this.db = {};
        this.index = {};

        this.APP_NAME = "example";
        this.config = {};
        this.MODULE = require('./app/module')(this);

        this.loadConfig(file);
    }
    loadConfig(file) {
        this.config = require(file);
    }
    init() {
        this.prepare();
    }
    prepare() {
        for (let i in this.config) {
            this.loadModule(i);
        }
    }
    loadModule(mod) {
        this.debug("info", "app", "load network " + mod)
        let CLS = require('./modules/' + mod + "/index")(this);
        this[mod] = new CLS(this.config[mod]);
    }
    debug(level, module_name, text) {

        if (!level)
            level = 'info';

        let arr = [
        ];
        for (let i in arguments) {
            if (i < 2)
                continue
            arr.push(arguments[i]);
        }

        this.emit("app.debug", {
            level: level,
            module: module_name,
            text: arr,
        });
    }
    run() {
        
    }
    throwError(message, code, details) {
        throw (
            appError({
                message: message,
                extendedInfo: details || "",
                code: code,
            })
        );
    }
    getLocalHomePath() {
        let homepath;
        if (process.platform == 'win32')
            homepath = process.env.APPDATA || process.env.USERPROFILE;
        else
            homepath = process.env.HOME;

        let dir = homepath + "/" + (process.platform == 'linux' ? "." : "") + this.APP_NAME;
        this.initDir(dir);
        return dir;
    }
    initDir(path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }
    exitHandler(exitCode) {
        if (exitCode != 0)
            this.emit("app.before.exit");
        if (exitCode != 0)
            console.log('Application will stop in 5 seconds....');

        setTimeout(function () {
            if (exitCode != 0)
                console.log("bye-bye -('o_0)-/")
            process.exit(0);
        }, 5000);
    }
}

module.exports = App;