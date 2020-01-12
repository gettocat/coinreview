const bitPony = require('bitpony');

module.exports = function (app) {

    class Block {

        constructor(data) {
            if (data instanceof Buffer || typeof data == 'string') {
                this.raw = data;
                this.unserialize();
            } else {
                this.initData(data);
            }
        }
        initData(data) {
            this.version = data.version;
            this.prev = data.prev;
            this.merkle = data.merkle;
            this.time = data.time;
            this.bits = data.bits;
            this.nonce = data.nonce;
            this.txs = [];
            for (let i in data.txs) {
                this.txs.push(new app.chain.TX(data.txs[i]));
            }
        }
        unserialize() {
            let b = new Buffer(this.raw, 'hex');
            let read = new bitPony.reader(b);
            let offset = 0;
            let res = read.uint32(offset);
            this.version = res.result;
            offset = res.offset;

            res = read.string(offset);
            this.prev = res.result.toString('hex');
            offset = res.offset;

            res = read.string(offset);
            this.merkle = res.result.toString('hex');
            offset = res.offset;

            res = read.uint32(offset);
            this.time = res.result;
            offset = res.offset;

            res = read.uint32(offset);
            this.bits = res.result;
            offset = res.offset;

            res = read.uint32(offset);
            this.nonce = res.result;
            offset = res.offset;

            res = read.var_int(offset);
            this.txcount = res.result;
            offset = res.offset;

            let buff = new Buffer(this.raw, 'hex');
            let b2 = buff;
            let  txs = [];
            for (let i = 0; i < this.txcount; i++) {
                b2 = b2.slice(offset, b2.length);
                let tx = new app.chain.TX(b2);
                offset = tx.unserialize();
                txs.push(tx);
            }

            this.txs = txs;

        }
        serialize() {
            let stream = new bitPony.writer(new Buffer(""));
            stream.uint32(this.version, true);
            stream.string(new Buffer(this.prev, 'hex'), true);
            stream.string(new Buffer(this.merkle, 'hex'), true);
            stream.uint32(this.time, true);
            stream.uint32(this.bits, true);
            stream.uint32(this.nonce, true);
            stream.var_int(this.txs.length, true);
            let buff = stream.getBuffer();
            let arr = [buff];
            for (let i in this.txs) {
                arr.push(this.txs[i].serialize());
            }
            return Buffer.concat(arr);
        }
        getJSON() {
            return {
                version: this.version,
                prev: this.prev,
                merkle: this.merkle,
                time: this.time,
                bits: this.bits,
                nonce: this.nonce,
                txs: (() =>{
                    let arr = [];
                    for (let i in this.txs){
                        arr.push(this.txs[i].getJSON())
                    }

                    return arr;
                })(),
            }
        }
        getBuffer(){
            return this.raw;
        }

    }

    return Block;

}