import {
    useLoaderData, Link, Form, useFetcher, useActionData
}  from "@remix-run/react";

import React from 'react';
import * as fs from 'node:fs/promises';

export const loader = async ({ params, request }) => {
    const jobFiles = await fs.readdir('./app/components/jobs');

    return {
        jobFiles: jobFiles,
        params: params
    };
};


import {Menu} from "~/components/menu";
import {SqlGrid} from "~/components/SqlGrid";
import { runSql} from "../components/database.mjs";
import { runPartiQL } from "../components/database.mjs";

export default function Jobs() {
    const data = useLoaderData();

    return(
        <div className="rootContainer">
            <Menu page='jobs' />
            <ul>
                {data.jobFiles.map((job,index) => {
                    return(<li key={index}>
                        <Link to={'/job/' + job.slice(0, -3)}>
                            {job.slice(0, -3)}
                        </Link>
                    </li>)
                })}
            </ul>

        </div>
    );

};
