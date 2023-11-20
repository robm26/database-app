import * as fs from 'node:fs/promises';
import { runSql} from "../components/database.mjs";
import { runPartiQL } from "../components/database.mjs";

const experimentResultsRoot = 'public/experiments';

let pathToJobsFolder = '../../jobs/'; // path if running a unit test
// let pathToExperimentsFolder = '../../experiments/';
let pathToExperimentsFolder = '../../' + experimentResultsRoot + '/';

const args = process.argv;

if(args.length === 3 && args[2] == 'build/index.js') { // live app
    pathToJobsFolder = '../jobs/';  // npm run dev
    // pathToExperimentsFolder = './experiments/';
    pathToExperimentsFolder = './' + experimentResultsRoot + '/';
}

const settings = {

}

const runJob = async (params) => {

    const experiment = params['experiment'];
    const test = params['test'];
    const dbEngine = params['dbEngine'];
    const targetTable = params['targetTable'];
    const PK = params['PK'];
    const jobFile = params['jobFile'];

    const jobFileNameImport = pathToJobsFolder + jobFile;

    const job = await import(jobFileNameImport);
    const jobInfo = job.jobInformation();
    const jobResults = [];
    let nowMs;
    let nowSec;
    const startMs = Date.now();
    const startSec = Math.floor(startMs/1000);
    let jobSecond = 0;

    if(jobInfo.jobType.toUpperCase() === 'INSERT') {
        const rowLimit = 100000000;
        const loopLimit = Math.min(rowLimit, jobInfo.items);

        for(let rowNum = 1; rowNum <= loopLimit; rowNum++){

            nowMs = Date.now();
            nowSec = Math.floor(nowMs/1000);
            jobSecond = nowSec - startSec;

            const row = job.rowMaker(rowNum);  // ***** crux of the job system
            const pkValue = row[PK];

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
                jobFile: jobFile.slice(8),
                operation: rowResult.operation,
                targetTable:targetTable,
                PK: pkValue,
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

    const jrColumns = Object.keys(jobResults[0]);

    const resultsFileData = jobResults.map(
        (item, index) => {

            return('\n' + jrColumns.map((col, idx) => {

                return(item[col]);
            }) );
        }).join('');

    const dir = pathToExperimentsFolder + experiment;

    await fs.mkdir(dir, { recursive: true });

    try {
        await fs.access(dir + '/data.csv', fs.constants.F_OK);
    } catch (err) {
        if(err?.code === 'ENOENT') {
            const dataFile = await fs.appendFile( dir + '/data.csv', jrColumns.toString(), 'utf-8', { flag: 'a' } );
        }
        // console.log('*** fs err' + JSON.stringify(err));
    }

    // await fs.access(dir + '/data.csv', fs.constants.F_OK, (err) => {
    //     console.log(`***** ${file} ${err ? 'does not exist' : 'exists'}`);
    // });

    const dataFile = await fs.appendFile( dir + '/data.csv', resultsFileData, 'utf-8', { flag: 'a' } );

    console.log('created ' + dir);

    return jobResults;
}

export {runJob};
