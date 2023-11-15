import {
    useLoaderData, Link, Outlet, useLocation, Form, useFetcher, useActionData
}  from "@remix-run/react";

import React from 'react';
import * as fs from 'node:fs/promises';

export const loader = async ({ params, request }) => {
    const jobFiles = await fs.readdir('./jobs');

    return {
        jobFiles: jobFiles,
        params: params
    };
};


import {Menu} from "~/components/menu";
import {SqlGrid} from "~/components/SqlGrid";
import { runSql} from "../components/database.mjs";
import { runPartiQL } from "../components/database.mjs";

export default function Jobs(params) {
    const data = useLoaderData();
    const loc = useLocation();
    const pathname = loc?.pathname;
    const currentJobName = pathname.split('/')[2];

    return(
        <div className="jobsContainer">
            <Menu page='jobs' />

            <table className='jobsBody'>
                <tbody>
                <tr><td>
                    <table className='jobList'>
                        <tbody>
                        {data.jobFiles.map((job,index) => {
                            const jobNameShort = job.slice(0, -3);
                            return(<tr key={index}>
                                <td className={currentJobName === jobNameShort ? 'jobSelected': null}>
                                <Link to={'/jobs/' + job.slice(0, -3)}>
                                    {job.slice(0, -3)}
                                </Link>
                            </td></tr>)
                        })}
                        </tbody>
                    </table>
                </td>
                    {currentJobName ? <td><Outlet /></td> : null}
                </tr>
                </tbody>
            </table>

        </div>
    );

};
