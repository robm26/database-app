const {randomString, pseudoRandomElement, randomElement, payloadData} = require('../app/components/util');

const rowMaker = (tick, second) => {
    const tickOffset = tick + 20;
    const newRow = {
        size: tick.toString(),
        rating: tick,
        payload: payloadData(tick - 0.3)
    };
    return newRow;
}

const jobInformation = () => {
    return {
        jobType: 'insert',
        targetTable: 'everysize',
        PK: 'size',
        description: 'Load table with items ranging from 1 KB to 400 KB',
        items: 400
    };
}

module.exports = { rowMaker, jobInformation };
