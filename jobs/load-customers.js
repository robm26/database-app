const {randomString, pseudoRandomElement} = require('../app/components/util');

const rowMaker = (tick, second) => {
    const tickOffset = tick + 20;
    const cities = ['Boston', 'New York', 'Seattle', 'Portland', 'San Jose', 'Tampa', 'Atlanta', 'Los Angeles', 'Dallas', 'London', 'Dublin', 'Amsterdam', 'Tel Aviv', 'Tokyo', 'Seoul'];
    const event = new Date();
    const eventOffsets = [-365, -240, -120, -90, -60, -30, -10, -2, -1, 0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610]
    const eventOffset = pseudoRandomElement(eventOffsets, tickOffset)();
    const eventDate = event.setDate(event.getDate() + eventOffset);

    const newRow = {
        cust_id: 'cust-' + ('000' + Math.floor((tick + 3) / 4)).slice(-3),
        contact: pseudoRandomElement(['staff', 'agent', 'partner'], tickOffset)() + '_' + ('000' + pseudoRandomElement(500, tick)()).slice(-3),
        city: pseudoRandomElement(cities, tickOffset)(),
        balance: 100 + pseudoRandomElement(100, tickOffset)(),
        last_updated: event.toISOString().replace('T',' ').replace('Z',' ').slice(0, -14)
    };
    return newRow;
}


const jobInformation = () => {
    return {
        jobType: 'insert',
        targetTable: 'customers',
        PK: 'cust_id',
        description: 'Load initial customer data',
        items: 20
    };
}

module.exports = { rowMaker, jobInformation };

