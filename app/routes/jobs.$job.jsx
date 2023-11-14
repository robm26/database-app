
// import {Menu} from "~/components/menu";
import React from "react";
import {useActionData, useLoaderData, Form, useNavigation} from "@remix-run/react";
import * as fs from 'node:fs/promises';

import {runJob} from "../components/jobExec.mjs";

const previewMax = 5;

export async function action({ params, request }) {

    const jobFileNameImport = '../jobs/' + params['job'] + '.js';

    const job = await import(jobFileNameImport);
    const jobInfo = job.jobInformation();

    const body = await request.formData();
    const _action = body.get("_action");
    let returned = {_action: _action};
    let previewRows = [];
    let outputRows = [];

    if(_action === 'preview') {
        for(let rowNum = 1; rowNum <= jobInfo.items; rowNum++){
            previewRows.push(job.rowMaker(rowNum));
            if(rowNum === previewMax) {
                rowNum = jobInfo.items;
            }
        }
        returned['previewRows'] = previewRows;
    }

    if(_action.slice(0, 3) === 'run') {
        const dbEngine = _action.slice(4);

        const params = {
            experiment: 'Exp1',
            test: 'MySQL Load Ten',
            dbEngine: dbEngine,
            targetTable: 'customers',
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

    const jobForm = (
        <Form id="jobForm" method="post"  >
            <div className='jobFormTableDiv'>
                <table className='jobFormTable'>
                    <tbody>
                    <tr><td className='jobDetailsTitle'>
                        type
                        </td>
                        <td>
                            {data.info.jobType.toUpperCase()}
                        </td>
                    </tr>
                    <tr><td className='jobDetailsTitle'>
                        description
                    </td><td colSpan='3'>
                        {data.info.description}
                    </td></tr>

                    <tr><td></td><td colSpan='3'>
                            <button type='submit' name='_action' value='code'>View Code</button>
                            &nbsp;&nbsp;
                            <button type='submit' name='_action' value='preview'>Preview</button>
                            &nbsp;&nbsp;
                            <button type='submit' name='_action' value='clear'>Clear</button>
                        </td>
                    </tr>
                    <tr><td className='jobDetailsTitle'>Run job on:</td><td>
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
        <table className='previewRowsTable'>
            <tbody>
            {!actionData?.previewRows ? [] : actionData?.previewRows.map((row, index) => (
                <tr key={index}>
                    <td>{index}</td>
                    <td>{JSON.stringify(row)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );

    const viewCode = (
        <textarea disabled name='sqlInput' id='sqlInput'
                  className='viewCodeTextarea' rows='10' cols='80'
                  defaultValue={data.jobFile}>

                </textarea>
    );
    const viewResults = !actionData?.jobResultsRaw ? null : (
        <div>
            <table className='resultDisplayTable'>
                <thead>
                <tr><th>Operation</th><th>Latency</th></tr>
                </thead><tbody>

            {actionData.jobResultsRaw.map((result, index)=>{
                return(
                    <tr key={index}><td>{result.operation}</td>
                        <td>{result.latency}</td></tr>
                );
            })}
            </tbody></table>
        </div>
    );

    return(

        <div className="jobRoot">
                <div> {jobForm}</div>

                <br/>
                {actionData?._action === 'code' ? viewCode: null}
                {actionData?._action === 'preview' ? previewRowsTable: null}
                {viewResults}

        </div>
    );

}

