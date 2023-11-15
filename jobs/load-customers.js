const {randomString, pseudoRandomElement} = require('../app/components/util');

const rowMaker = (tick, second) => {
    const tickOffset = tick + 20;
    const cities = ['Boston', 'New York', 'Seattle', 'Portland', 'San Jose', 'Atlanta', 'Los Angeles', 'Dallas', 'London', 'Dublin', 'Amsterdam', 'Tel Aviv', 'Tokyo', 'Seoul'];
    const newRow = {
        cust_id: 'cust-' + ('000' + Math.floor((tick + 3) / 4)).slice(-3),
        contact: pseudoRandomElement(['staff', 'agent', 'partner'], tickOffset)() + '_' + ('000' + pseudoRandomElement(500, tick)()).slice(-3),
        city: pseudoRandomElement(cities, tickOffset)(),
        balance: 100 + pseudoRandomElement(100, tickOffset)(),
        last_updated: '2023-11-22'
    };
    return newRow;
}


const jobInformation = () => {
    return {
        jobType: 'insert',
        targetTable: 'customers',
        description: 'Load initial customer data',
        items: 20
    };
}

module.exports = { rowMaker, jobInformation };

