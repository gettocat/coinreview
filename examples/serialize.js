let App = require("../app")
let app = new App('./examples/cnf.json');
app.loadModule('chain');
let txjson = {
    version: 1,
    in: [
        {
            hash: '000000000000000000000000000000000000000000000000000000000000000',
            index: 0,
            key: '000000000000000000000000000000000000000000000000000000000000000',
            sign: '000000000000000000000000000000000000000000000000000000000000000'
        },
        {
            hash: '000000000000000000000000000000000000000000000000000000000000000',
            index: 1,
            key: '000012300000000000000000000000000000000000000000000000000000000000',
            sign: '0000000000002523523000000000000000000000000000000000000000000000000000'
        }
    ],
    out: [
        {
            address: '02a832289414cc0a402022beb17f8432c3fed3c3187036bb83e359917df26b8b56',
            amount: 1
        },
        {
            address: '02a832289414cc0a402022beb17f8432c3fed3c3187036bb83e359917df26b8b56',
            amount: 5
        },
        {
            address: '02a832289414cc0a402022beb17f8432c3fed3c3187036bb83e359917df26b8b56',
            amount: 5832356
        }
    ]
};
let tx = new app.chain.TX(txjson);

let hex = tx.serialize().toString('hex');
let tx2 = new app.chain.TX(hex);
tx2.unserialize()
console.log(tx2.getJSON());


let block = new app.chain.BLOCK({
    version: 1,
    prev: '000000000000000000000000000000000000000000000000000000000000000',
    merkle: '000000000000000000000000000000000000000000000000000000000000000',
    time: 15038374,
    bits: 0xfd0022,
    nonce: 155,
    txs: [
        txjson,
        {
            version: 2,
            in: [
                {
                    hash: '000000000000000000000000000000000000000000000000000000000000000',
                    index: 2,
                    key: '4444',
                    sign: '5555'
                },
                {
                    hash: '000000000000000000000000000000000000000000000000000000000000000',
                    index: 3,
                    key: '000012300000000000000000000000000000000000000000000000000000000000',
                    sign: '0000000000002523523000000000000000000000000000000000000000000000000000'
                }
            ],
            out: [
                {
                    address: '02a832289414cc0a402022beb17f8432c3fed3c3187036bb83e359917df26b8b56',
                    amount: 50
                },
                {
                    address: '02a832289414cc0a402022beb17f8432c3fed3c3187036bb83e359917df26b8b56',
                    amount: 606
                },
                {
                    address: '02a832289414cc0a402022beb17f8432c3fed3c3187036bb83e359917df26b8b56',
                    amount: 134
                }
            ]
        }
    ]
});

let hex2 = block.serialize().toString('hex');
let block2 = new app.chain.BLOCK(hex2);
block2.unserialize();
console.log(JSON.stringify(block2.getJSON()));
