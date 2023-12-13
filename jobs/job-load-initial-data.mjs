import {runJob} from "../app/components/jobExec.mjs";


(async() => {
    // const runResult = await run();
    const jobList = [
        {
            experiment: 'Setup Customers', test: 'load-customers',
            dbEngine: 'dynamodb', targetTable: 'customers',
            items: 100,
            PK: 'cust_id',
            jobFile: 'load-customers.js'
        },
        {
            experiment: 'Setup Products', test: 'load-products',
            dbEngine: 'dynamodb', targetTable: 'products',
            items: 100,
            PK: 'prod_id',
            jobFile: 'load-products.js'
        },
        {
            experiment: 'Setup Everysize', test: 'load-everysize',
            dbEngine: 'dynamodb', targetTable: 'everysize',
            items: 400,
            PK: 'size',
            jobFile: 'load-everysize.js'
        }
    ];


    for(const job in jobList) {
        console.log('running job ' + jobList[job].experiment + ' ' + jobList[job].test + ' on ' + jobList[job].dbEngine + ' : ' + jobList[job].targetTable);
        const results = await runJob(jobList[job]);
    }
    process.exit(1);

})()


