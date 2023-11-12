const rowMaker = (tick, second) => {
    const newRow = {
        user_id: (4000 + tick).toString(),
        firstname: 'Marco',
        lastname: 'Cat',
        email: 'marco@cat.com',
        city: 'Stoneham',
        credit_rating: (tick * 2).toString()
    };
    return newRow;
}

const jobInformation = () => {
    return {
        jobType: 'load',
        description: 'Read single items',
        items: 4
    };
}

module.exports = { rowMaker, jobInformation };

