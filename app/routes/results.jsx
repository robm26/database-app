
import {Menu} from "~/components/menu";
import React from "react";
import * as fs from 'node:fs/promises';
import {Link, Outlet, useLoaderData, useActionData, useLocation, Form} from "@remix-run/react";

const experimentResultsRoot = 'public/experiments';

export async function action({ params, request }) {
    const body = await request.formData();
    // const _action = body.get("_action");
    // const jobId = params['job'];

    // TODO: check that the request is to clear experiment folders

    const experimentFolders = await fs.readdir('./' + experimentResultsRoot);

    experimentFolders.map((expFolder,index) => {
        fs.rm('./' + experimentResultsRoot + '/' + expFolder, {recursive: true});
    });

    return {
        params:params,
        cleared:true
    }
}
export const loader = async ({ params, request }) => {
    let experimentFolders = [];
    try {
        experimentFolders = await fs.readdir('./' + experimentResultsRoot);
    } catch (error) {
        console.log('no experiment folders yet');
    }


    return {
        experimentFolders: experimentFolders,
        params: params
    };
};

export default function Results() {
    const data = useLoaderData();
    const actionData = useActionData();

    const loc = useLocation();
    const pathname = loc?.pathname;
    const currentExperimentName = pathname.split('/')[2];

    const noFoldersMsg = (<span>No experiment results found in /experiments. <br/><br/>Results of your job executions will appear here.</span>);
    const clearButton = (<tr><td>{
        data.experimentFolders.length === 0 ? noFoldersMsg :
            (<button type='submit' name='_action' className='clearExperimentsButton'
                    value='clearExperiments' >clear all
            </button>)
    }</td></tr>);

    return(

        <div className="rootContainer">
            <Menu page='results' />

            <table className='jobsBody'>
                <tbody>
                <tr><td>
                    <table className='jobList'>
                        <tbody>
                        {data.experimentFolders.length === 0 ? (<tr><td>
                            Job results will appear here. Click the jobs menu to run a job.
                        </td></tr>) : null}
                        {data.experimentFolders.map((experiment,index) => {

                            return(<tr key={index}>
                                <td className={currentExperimentName === encodeURIComponent(experiment) ? 'jobSelected': null}>
                                    <Link to={'/results/' + experiment}>
                                        {experiment}
                                    </Link>
                                </td></tr>)
                        })}
                        {/*{currentExperimentName ? null : clearButton}*/}
                        </tbody>
                    </table>
                </td>
                    {currentExperimentName ? <td className='expListTd'>
                        <Outlet />
                    </td> : null}
                </tr>
                </tbody>
            </table>

        </div>

    );
}
