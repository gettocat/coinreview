const bitPony = require('bitpony');

module.exports = function (app) {

    class Tx {

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
            this.in = data.in;
            this.out = data.out;
        }
        readIns(offset, stream) {
            let result = stream.var_int(offset);
            offset = result.offset;
            let cnt = result.result;

            let ins = [];

            for (let i = 0; i < cnt; i++) {
                let d = {};
                result = stream.string(offset);
                offset = result.offset;
                d.hash = result.result.toString('hex');

                result = stream.uint32(offset);
                offset = result.offset;
                d.index = result.result;

                result = stream.string(offset);
                offset = result.offset;
                d.key = result.result.toString('hex');

                result = stream.string(offset);
                offset = result.offset;
                d.sign = result.result.toString('hex');

                ins.push(d);
            }

            return {
                result: ins,
                offset: offset
            }
        }
        writeIns(stream) {
            stream.var_int(this.in.length, true);
            for (let i in this.in) {
                stream.string(new Buffer(this.in[i].hash, 'hex'), true);
                stream.uint32(this.in[i].index, true);
                stream.string(new Buffer(this.in[i].key, 'hex'), true);
                stream.string(new Buffer(this.in[i].sign, 'hex'), true);
            }
        }
        readOuts(offset, stream) {
            let result = stream.var_int(offset);
            offset = result.offset;
            let cnt = result.result;

            let outs = [];

            for (let i = 0; i < cnt; i++) {
                let d = {};
                result = stream.string(offset);
                offset = result.offset;
                d.address = result.result.toString('hex');

                result = stream.uint64(offset);
                offset = result.offset;
                d.amount = result.result;

                outs.push(d);
            }

            return {
                result: outs,
                offset: offset
            }
        }
        writeOuts(stream) {
            stream.var_int(this.out.length, true);
            for (let i in this.out) {
                stream.string(new Buffer(this.out[i].address, 'hex'), true);
                stream.uint64(this.out[i].amount, true);
            }
        }
        unserialize() {
            let b = new Buffer(this.raw, 'hex');
            let read = new bitPony.reader(b);
            let offset = 0;
            let res = read.uint32(offset);
            this.version = res.result;
            offset = res.offset;
            let result = this.readIns(offset, read);
            offset = result.offset;
            this.in = result.result;
            result = this.readOuts(offset, read);
            offset = result.offset;
            this.out = result.result;
            return result.offset;
        }
        serialize() {
            let stream = new bitPony.writer(new Buffer(""));
            stream.uint32(this.version, true);
            this.writeIns(stream);
            this.writeOuts(stream);
            return stream.getBuffer();
        }
        getJSON() {
            return {
                version: this.version,
                in: this.in,
                out: this.out
            }
        }
        getBuffer(){
            return this.raw;
        }

    }

    return Tx;

}