const {randomString, md5, randomElement} = require('../app/components/util');

const rowMaker = (tick, second) => {
    const cities = getCities();
    const newRow = {
        cust_id: 'cust-' + tick,
        name: 'Customer ' + tick,
        email: 'luna@dog.com',
        city: randomElement(getCities()),
        last_updated: '2023-11-22',
        credit_rating: (tick * 80).toString()
    };
    return newRow;
}
const getCities = () => {
    return ['Boston', 'New York', 'Seattle', 'Portland', 'San Jose', 'Atlanta', 'Los Angeles', 'Dallas', 'London', 'Dublin', 'Amsterdam', 'Tel Aviv', 'Tokyo', 'Seoul'];
}

const jobInformation = () => {
    return {
        jobType: 'insert',
        targetTable: 'customers',
        description: 'Load initial data',
        items: 20
    };
}

module.exports = { rowMaker, jobInformation };

