
import { DynamoDBClient,  DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import * as fs from 'node:fs/promises';
import { runSql} from "../components/database.mjs";
import { runPartiQL } from "../components/database.mjs";


let pathToJobsFolder = '../../jobs/'; // path if running a unit test
const args = process.argv;
if(args.length === 3 && args[2] == 'build/index.js') {
    pathToJobsFolder = '../jobs/';  // npm run dev
}

const settings = {

}

const runJob = async (params) => {

    const experiment = params['experiment'];
    const test = params['test'];
    const dbEngine = params['dbEngine'];
    const targetTable = params['targetTable'];
    const PK = params['PK'];
    let PkValue;
    const jobFileNameImport = pathToJobsFolder + params['jobFile'];

    const job = await import(jobFileNameImport);
    const jobInfo = job.jobInformation();
    const jobResults = [];
    let nowMs;
    let nowSec;
    const startMs = Date.now();
    const startSec = Math.floor(startMs/1000);
    let jobSecond = 0;

    if(jobInfo.jobType.toUpperCase() === 'INSERT') {
        for(let rowNum = 1; rowNum <= jobInfo.items; rowNum++){

            nowMs = Date.now();
            nowSec = Math.floor(nowMs/1000);
            jobSecond = nowSec - startSec;

            const row = job.rowMaker(rowNum);  // ***** crux of the job system


            let rowResult;
            if(dbEngine === 'mysql') {
                const sql = 'INSERT INTO ' + targetTable + ' (' + Object.keys(row).join(",") + ') '
                    + 'VALUES (' + Object.values(row).map(val=> "'" + val + "'").join(",") + ');';
                rowResult = await runSql(sql);

            }
            if(dbEngine === 'dynamodb') {
                const pqlDoubleQuotes = "INSERT INTO " + targetTable + " VALUE " + JSON.stringify(row) + ";";
                const pql = pqlDoubleQuotes.replaceAll('"', "'");
                rowResult = await runPartiQL(pql);

            }
            // console.log(JSON.stringify(rowResult, null, 2));
            let rowSummary = {
                rowNum: rowNum,
                dbEngine: dbEngine,
                experiment: experiment,
                test: test,
                operation: rowResult.operation,
                targetTable:targetTable,
                PK: PK,
                jobSecond: jobSecond,
                latency: rowResult.latency,
                httpStatusCode: rowResult?.result?.$metadata?.httpStatusCode,
                attempts: rowResult?.result?.$metadata?.attempts,
                ConsumedCapacity: rowResult?.result?.ConsumedCapacity?.CapacityUnits
            };
            // rowResult enrichment
            jobResults.push(rowSummary);

        }
    }

    return jobResults;
}

export {runJob};
