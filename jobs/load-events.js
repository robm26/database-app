const {randomString, pseudoRandomElement, randomElement} = require('../app/components/util');

const rowMaker = (tick, second) => {
    const cities = ['Boston', 'New York', 'Seattle', 'Portland', 'San Jose', 'Atlanta', 'Los Angeles', 'Dallas', 'London', 'Dublin', 'Amsterdam', 'Tel Aviv', 'Tokyo', 'Seoul', '', ''];
    const products = ['Bicycle', 'Car', 'Truck', 'Motorcycle', 'Bus', 'Moped', 'Tricycle', 'Scooter', 'Skateboard', 'Snowboard', 'Helicopter', 'Jet Ski', 'Kayak', 'Canoe', '', ''];
    const statuses = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'RETURNED'];
    const tickOffset = tick + 20;

    const newRow = {
        event_id: 'e' + ('0000' + tick).slice(-4),
        product: pseudoRandomElement(products, tickOffset)(),
        rating: 300 + pseudoRandomElement(1000, tickOffset)(),
        city: pseudoRandomElement(cities, tickOffset)(),
        status: pseudoRandomElement(statuses, tickOffset)(),
        balance: 100 + pseudoRandomElement(100, tickOffset)(),
        last_updated: '2023-11-22'
    };


    return newRow;
}

const jobInformation = () => {
    return {
        jobType: 'insert',
        targetTable: 'events',
        PK: 'event_id',
        description: 'Load event data',
        items: 50
    };
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = { rowMaker, jobInformation };

