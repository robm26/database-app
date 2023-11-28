
// import {Menu} from "~/components/menu";
import React from "react";
import {useActionData, useLoaderData, Form, useNavigation} from "@remix-run/react";
import * as fs from 'node:fs/promises';

import {SqlGrid} from "~/components/SqlGrid";
import {runJob} from "../components/jobExec.mjs";

const previewMax = 10;

export async function action({ params, request }) {
    // const randSuffix = randomString(4);
    const jobId = params['job'];

    const jobFileNameImport = '../jobs/' + jobId + '.js';
    const jobFileName = './jobs/' + jobId + '.js';

    const job = await import(jobFileNameImport);

    const jobInfo = job.jobInformation();

    const body = await request.formData();
    const _action = body.get("_action");
    const experiment = body.get("experiment");
    const test = body.get("test");
    const targetTable = body.get("targetTable");
    // const compare = body.get("compare");

    let returned = {_action: _action};

    // returned['randSuffix'] = randSuffix;

    let previewRows = [];
    let outputRows = [];

    if(_action.slice(0,4) === 'code') {
        const jobCode = await fs.readFile( jobFileName, 'utf-8');
        returned['code'] = jobCode;
    }

    if(_action.slice(0,7) === 'preview') {
        for(let rowNum = 1; rowNum <= jobInfo.items; rowNum++){
            previewRows.push(job.rowMaker(rowNum));
            if(rowNum === previewMax) {
                rowNum = jobInfo.items;
            }
        }
        returned['previewRows'] = previewRows;
        returned['code'] = null;
    }

    if(_action.slice(0, 3) === 'run') {
        returned['code'] = null;

        const dbEngine = _action.slice(4);

        const params = {
            experiment: experiment,
            test: test,
            job:jobId,
            dbEngine: dbEngine,
            PK:jobInfo.PK,
            targetTable: targetTable,
            jobFile: jobFileNameImport
        };

        const results = await runJob(params);

        returned['jobResultsRaw'] = results;
    }

    return returned;

}

export const loader = async ({ params, request }) => {

    const jobFileName = './jobs/' + params['job'] + '.js';
    const jobFileNameImport = '../jobs/' + params['job'] + '.js';

    const jobFile = await fs.readFile(jobFileName, 'utf-8');

    const job = await import(jobFileNameImport);
    const jobInfo = job.jobInformation();

    return {params: params, jobFile: jobFile, info: jobInfo};
};

export default function Job(params) {
    const data = useLoaderData();
    const actionData = useActionData();
    const navigation = useNavigation();
    // const randSuffix = actionData?.randSuffix;

    const jobForm = (
        <Form id="jobForm" method="post"  >
            <div className='jobFormTableDiv'>
                <table className='jobFormTable'>
                    <tbody>
                    <tr key={1}><td className='jobDetailsTitle'>
                        Description
                    </td><td colSpan='3'>
                        {data.info.description}
                    </td></tr>
                    <tr key={2}><td className='jobDetailsTitle'>
                        Type
                    </td>
                        <td>
                            {data.info.jobType.toUpperCase()}
                        </td>
                    </tr>
                    <tr key={3}><td className='jobDetailsTitle'>
                        Item count
                    </td><td colSpan='3'>
                        {data.info.items}
                    </td></tr>
                    <tr key={4}><td className='jobDetailsTitle'>Experiment</td><td>
                        <input type='text' name='experiment' id='experiment' className='jobInputs'
                               defaultValue={actionData?.experiment || 'Experiment 1'} />
                    </td></tr>
                    <tr key={5}><td className='jobDetailsTitle'>Test</td><td>
                        <input type='text' name='test' id='test' className='jobInputs'
                               defaultValue={actionData?.test || 'Test 1'} />
                    </td></tr>
                    <tr key={6}><td className='jobDetailsTitle'>Target Table</td><td>
                        <input type='text' name='targetTable' id='targetTable' className='jobInputs'
                               defaultValue={actionData?.targetTable || data?.info?.targetTable || ''} />
                    </td></tr>
                    {/*<tr key={7}><td className='jobDetailsTitle'>Compare</td><td>*/}
                    {/*    <input type='text' name='compare' id='compare' className='jobInputs'*/}
                    {/*           defaultValue={actionData?.compare || 'dbEngine'} />*/}
                    {/*</td></tr>*/}

                    <tr key={8}><td></td><td colSpan='3'>
                        <button type='submit' name='_action' value={'code' + Math.random().toString()} >View Code</button>
                        &nbsp;&nbsp;
                        <button type='submit' name='_action' value='preview'>Preview</button>
                        &nbsp;&nbsp;
                        <button type='submit' name='_action' value='clear'>Clear</button>
                    </td>
                    </tr>
                    <tr key={9}><td className='jobDetailsTitle'>Run job on:</td><td>
                        <button type='submit' name='_action' value='run-mysql' className='mysqlSetupButton'
                        >MySQL</button>
                    </td><td>
                        <button type='submit' name='_action' value='run-dynamodb' className='ddbSetupButton'
                        >DynamoDB</button>
                    </td></tr>
                    </tbody>
                </table>
            </div>

        </Form>
    );

    const previewRowsTable = (
        <SqlGrid data={actionData?.previewRows} />
    );

    const viewCode = !actionData?.code ? null : (
        <textarea disabled name='sqlInput' id='sqlInput'
                  className='viewCodeTextarea' rows='20' cols='80'
                  defaultValue={actionData?.code}>
                </textarea>
    );

    const jobResultColumnList = ['rowNum','dbEngine','targetTable', 'PK',
        'operation', 'jobFile', 'jobSecond', 'jobElapsed', 'jobTimestamp', 'jobTimestampMs',
        'latency','experiment','test',
        'httpStatusCode', 'attempts','ConsumedCapacity'];


    const itemsProcessed = actionData?.jobResultsRaw?.length;
    const totalLatency = actionData?.jobResultsRaw?.reduce((acc, curr) => acc + curr.latency, 0);
    const averageLatency = Math.floor(totalLatency / itemsProcessed);
    // const totalDuration = actionData?.jobResultsRaw[actionData?.jobResultsRaw?.length-1]['jobSecond'];
    // const averageVelocity = (itemsProcessed / totalDuration).toFixed(1);

    const viewResults = !actionData?.jobResultsRaw ? null : (
        <div>
            Job Results:
            <table className='jobResultsSummaryTable'>
                <thead>
                <tr key={1}><th colSpan='2'>Job Summary</th></tr></thead>
                <tbody>

                <tr key={2}><td>Engine</td><td>{actionData?.jobResultsRaw[0]?.dbEngine}</td></tr>
                <tr><td>Items Processed</td><td>{itemsProcessed}</td></tr>
                {/*<tr><td>Total Duration (sec)</td><td>{totalDuration}</td></tr>*/}
                {/*<tr><td>Average Velocity (items/sec)</td><td>{averageVelocity}</td></tr>*/}
                <tr key={3}><td>Average request Latency (ms)</td><td>{averageLatency}</td></tr>
                </tbody>
            </table>
            <br/>

            <details>
                <summary>Result details</summary>
                <table className='resultDisplayTable'>
                <thead>
                <tr key={1}>
                    {jobResultColumnList.map((col, index) => {
                        return (<th key={index}>{col}</th>);
                    })}
                </tr>
                </thead><tbody>

            {actionData.jobResultsRaw.map((result, index)=>{

                return(
                    <tr key={index}>
                        {jobResultColumnList.map((col, index) => {

                            return (<td key={index}>{result[col]}</td>);
                        })}

                    </tr>
                );
            })}
            </tbody></table>
            </details>
        </div>
    );

    return(
        <div>
            <div > {jobForm}</div>
            <br/>
            {viewCode}
            <div className="jobResultsTable">
                {previewRowsTable}
                {viewResults}
            </div>


        </div>
    );

}
