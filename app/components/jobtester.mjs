import {runJob} from "./jobExec.mjs";

const run = async () => {

    const params = {
        experiment: 'Exp3',
        test: 'EventsTest',
        dbEngine: 'dynamodb',
        targetTable: 'events_indexed',
        items: 10,
        PK: 'event_id',
        jobFile: 'load-events.js'
    };

    const results = await runJob(params);
    console.log(results);
};

void run().then(()=>{
    process.exit(1);
});
