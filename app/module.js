module.exports = function (app) {
    class Module {

        constructor(){

        }
        debug(level, text){
            let lev = arguments[0];
            let arr = Array.from(arguments).slice(1);
            arr.unshift(this.constructor.name);
            arr.unshift(lev);
            app.debug.apply(app, arr);
        }
        getModuleName(){
            return this.constructor.name;
        }

    }

    return Module;
}