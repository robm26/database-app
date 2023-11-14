
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
    const jobFileNameImport = pathToJobsFolder + params['jobFile'];

    const job = await import(jobFileNameImport);
    const jobInfo = job.jobInformation();
    const jobResults = [];

    if(jobInfo.jobType.toUpperCase() === 'INSERT') {
        for(let rowNum = 1; rowNum <= jobInfo.items; rowNum++){
            const row = job.rowMaker(rowNum);

            if(dbEngine === 'mysql') {
                const sql = 'INSERT INTO ' + targetTable + ' (' + Object.keys(row).join(",") + ') '
                    + 'VALUES (' + Object.values(row).map(val=> "'" + val + "'").join(",") + ');';
                const rowResult = await runSql(sql);
                jobResults.push(rowResult);
            }
            if(dbEngine === 'dynamodb') {
                const pqlDoubleQuotes = "INSERT INTO " + targetTable + " VALUE " + JSON.stringify(row) + ";";
                const pql = pqlDoubleQuotes.replaceAll('"', "'");
                const rowResult = await runPartiQL(pql);
                jobResults.push(rowResult);
            }

        }
    }

    return jobResults;
}

export {runJob};
