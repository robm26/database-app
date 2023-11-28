const rowMaker = (tick, second) => {
    return getDataRow(tick);
}

const jobInformation = () => {
    return {
        jobType: 'insert',
        targetTable: 'cities',
        PK: 'city',
        description: 'Load initial city data',
        items: 4
    };
}

function getDataRow(index) {

    let data = [
        { city: 'Las Vegas', state: 'NV', pop: 641000, url: 'https://s3.amazonaws.com/my-bucket/photo.jpg' },
        { city: 'Seattle',   state: 'WA', pop: 737000, url: 'https://s3.amazonaws.com/my-bucket/photo.jpg' },
        { city: 'Boston',    state: 'MA', pop: 650000, url: 'https://s3.amazonaws.com/my-bucket/photo.jpg' },
        { city: 'Wakefield', state: 'MA', pop: 28000, url: 'https://s3.amazonaws.com/my-bucket/photo.jpg' }
    ];

    if(!index || index > data.length) {
        console.log('error, data index out of range');
    } else {
        return data[index-1];
    }

}

module.exports = { rowMaker, jobInformation };

