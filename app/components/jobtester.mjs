import {runJob} from "./jobExec.mjs";

const run = async () => {

    const params = {
        experiment: 'Exp7',
        test: 'Products',
        dbEngine: 'dynamodb',
        targetTable: 'products',
        PK: 'prod_id',
        jobFile: 'load-products.js'
    };

    const results = await runJob(params);
    console.log(results);
};

void run().then(()=>{
    process.exit(1);
});
