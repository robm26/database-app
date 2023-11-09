const jobInformation = () => {
    return {
        description: 'This is the first job',
        items: 5
    };
}

const rowMaker = (tick, second) => {

    const newRow = {
        user_id: (3000 + tick).toString(),
        firstname: 'Luna',
        lastname: 'Dog',
        email: 'luna@dog.com',
        city: 'Wakefield',
        credit_rating: (tick * 10).toString()
    };

    return newRow;
}

module.exports = { rowMaker, jobInformation };

