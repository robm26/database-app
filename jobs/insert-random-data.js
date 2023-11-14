const {randomString, randomChoiceSeeded, md5} = require('../app/components/util');

const rowMaker = (tick, second) => {
    const newRow = {
        cust_id: randomString(10),
        name: 'Lunae',
        email: 'luna@edog.com',
        city: 'Melrose',
        last_updated: '2023-11-22',
        credit_rating: (tick * 11).toString()
    };
    return newRow;
}

const jobInformation = () => {
    return {
        jobType: 'insert',
        targetTable: 'customers',
        description: 'Load initial data',
        items: 5
    };
}

module.exports = { rowMaker, jobInformation };

