import {runJob} from "./jobExec.mjs";

const run = async () => {

    const params = {
        experiment: 'Exp7',
        test: 'ProductsTest2',
        dbEngine: 'mysql',
        targetTable: 'products',
        items: 10,
        PK: 'prod_id',
        jobFile: 'load-products.js'
    };

    const results = await runJob(params);
    console.log(results);
};

void run().then(()=>{
    process.exit(1);
});
