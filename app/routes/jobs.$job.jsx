
// import {Menu} from "~/components/menu";
import React from "react";
import {useActionData, useLoaderData, Form} from "@remix-run/react";
import * as fs from 'node:fs/promises';


// const jobFileName = './app/components/jobs/' + params['job'] + '.js';
// const jobFileNameImport = '../app/components/jobs/' + params['job'] + '.js';

export async function action({ params, request }) {

    const jobFileName = './app/components/jobs/' + params['job'] + '.js';
    const jobFileNameImport = '../app/components/jobs/' + params['job'] + '.js';

    const job = await import(jobFileNameImport);
    const jobInfo = job.jobInformation();

    const body = await request.formData();
    const _action = body.get("_action");
    let returned = {_action: _action};
    let previewRows = [];
    let outputRows = []

    if(_action === 'preview') {
        for(let rowNum = 1; rowNum <= jobInfo.items; rowNum++){
            previewRows.push(job.rowMaker(rowNum))
        }
    }

    if(_action === 'run') {
        for(let rowNum = 1; rowNum <= jobInfo.items; rowNum++){
            outputRows.push(job.rowMaker(rowNum))
        }
    }

    returned['previewRows'] = previewRows;
    return returned;

}

export const loader = async ({ params, request }) => {

    const jobFileName = './app/components/jobs/' + params['job'] + '.js';
    const jobFileNameImport = '../app/components/jobs/' + params['job'] + '.js';

    const jobFile = await fs.readFile(jobFileName, 'utf-8');

    const job = await import(jobFileNameImport);
    const jobInfo = job.jobInformation();


    return {params: params, jobFile: jobFile, info: jobInfo};
};

export default function Job(params) {
    const data = useLoaderData();
    const actionData = useActionData();

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

                    <tr><td></td><td>
                            <button type='submit' name='_action' value='code'>View Code</button>
                        </td><td>
                            <button type='submit' name='_action' value='preview'>Preview</button>
                        </td><td>
                            <button type='submit' name='_action' value='run'>Run</button>
                        </td><td>
                            <button type='submit' name='_action' value='clear'>Clear</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

        </Form>
    );

    const previewRowsTable = (
        <table className='previewRowsTable'>
            <tbody>
            {actionData?.previewRows.map((row, index) => (
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

    return(

        <div className="jobRoot">
                <div> {jobForm}</div>
                <br/>
                {actionData?._action === 'code' ? viewCode: null}
                {actionData?._action === 'preview' ? previewRowsTable: null}

        </div>
    );

}

