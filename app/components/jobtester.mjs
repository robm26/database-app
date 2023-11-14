import {runJob} from "./jobExec.mjs";


const run = async () => {

    const params = {
        experiment: 'Exp1',
        test: 'MySQL Load Ten',
        dbEngine: 'dynamodb',
        targetTable: 'customers',
        jobFile: 'job1.js'
    };

    const results = await runJob(params);
    console.log(results);
};

void run().then(()=>{
    process.exit(1);
});
