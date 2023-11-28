import {runJob} from "./jobExec.mjs";

const run = async () => {

    const params = {
        experiment: 'Exp7',
        test: 'ProductsTest2',
        dbEngine: 'dynamodb',
        targetTable: 'products',
        items: 4,
        PK: 'prod_id',
        jobFile: 'load-products.js'
    };

    const results = await runJob(params);
    console.log(results);
};

void run().then(()=>{
    process.exit(1);
});
