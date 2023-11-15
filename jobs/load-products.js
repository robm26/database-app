const {randomString, pseudoRandomElement, randomElement} = require('../app/components/util');

const rowMaker = (tick, second) => {
    const tickOffset = tick + 20;
    const products = ['Bicycle', 'Car', 'Truck', 'Motorcycle', 'Bus', 'Moped', 'Tricycle', 'Scooter', 'Skateboard', 'Snowboard', 'Helicopter', 'Jet Ski', 'Kayak', 'Canoe'];
    const newRow = {
        prod_id: 'p' + randomString(8),
        name: randomElement(products),
        category: pseudoRandomElement(['Clothing', 'Electronics', 'Food', 'Games', 'Health', 'Home', 'Kids', 'Movies', 'Music', 'Shoes', 'Sports', 'Toys', 'Other'], tickOffset)(),
        list_price: 100 + pseudoRandomElement(1000, tickOffset)(),
        s3_url: 'https://s3.amazonaws.com/my-bucket/folder' + tick + '/image.jpg',
        last_updated: '2023-11-22'
    };
    return newRow;
}


const jobInformation = () => {
    return {
        jobType: 'insert',
        targetTable: 'products',
        description: 'Load initial product data',
        items: 100
    };
}

module.exports = { rowMaker, jobInformation };

