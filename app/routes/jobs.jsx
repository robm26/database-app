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

    const welcomeMsg = (<div className='jobsWelcome'>

        <details>
            <summary>Intro</summary>
            <p>Selecting a database for your application is a little like buying a car. You need to choose which brand,
                model, and options will best meet your requirements and feel right.
                You can research each car's features, performance, and specifications; but it is not until you test drive
                a few models that you really understand which one is best for you. </p>
            <p>The beauty of a test drive is that you can put each car through the exact same routine and see how it performs.
                Your criteria could include things like how well the car handles a certain sharp turn,
                how much room your family member passengers have, or how many cup holders and phone chargers exist.</p>
            <p>With database workloads, common criteria include the latency of read requests,
                 throughput velocity for bulk write operations, and the total cost of ownership.</p>
            <p>This application allows you to perform multiple test drives of the same workload, each one with
                different database configurations. Thinking like a scientist, you can perform tests alone,
                or as part of a larger experiment that is designed to highlight the performance
                impact of changing one parameter.</p>
        </details>
        <span>Jobs, Experiments, and Tests</span>
        <p>⬅️ Each job shown here is a Javascript file that defines a function called <b>rowMaker</b>.
            This function will be called repeatedly by the job executor (jobExec.js), with each
            invocation passing in a unique, incrementing tick number.
        </p>
        <p>In this way, random or quasi-random sample data can be generated for write tests,
            and query conditions can be generated for read tests.
            Within a job, you can see the job name and item count, and then click to review the job code
            and see a preview of the first ten generated request items.
        </p>
        <p>The read or write items are converted to SQL or PartiQL commands,
            and sent to <b>database.mjs</b> which in turn runs the commands on the target
            database, either MySQL or DynamoDB.</p>
        <p>
            For each request, the round trip latency along with several metadata parameters are
            captured and appended to a file called data.csv.  The CSV file data can be viewed by
            clicking the <a href='/results'>results</a> tab.
            Each named experiment will generate a corresponding folder within the
            /experiments folder on the application filesystem.
        </p>

    </div>);


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
                        {currentJobName ? <td><Outlet /></td> : welcomeMsg}
                    </tr>
                    </tbody>
                </table>


        </div>
    );

};
