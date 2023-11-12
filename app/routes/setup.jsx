
import {Menu} from "~/components/menu";
import React from "react";
import * as fs from 'node:fs/promises';
import { useActionData, useLoaderData, Form} from "@remix-run/react";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { DynamoDBClient, DescribeEndpointsCommand } from "@aws-sdk/client-dynamodb";
import { config } from "../components/mysql-credentials.mjs";
import { runSql } from "../components/database.mjs";

const mysqlCreateStatus = 'ok';
const ddbCreateStatus = 'ok';


export async function action({ params, request }) {
    const body = await request.formData();
    const action = body.get("action");

    let status;
    let counter = 0;


    if(action === 'mysqlCreate') {
        const mysqlSetupFiles = await fs.readdir('./setup/mysql');

        for (const file of mysqlSetupFiles) {
            let sql = 'DROP TABLE IF EXISTS ' + file + ';';
            let result = await runSql(sql);

            sql = await fs.readFile('./setup/mysql/' + file, 'utf-8');
            result = await runSql(sql);
            counter += 1;
        }


        status = 'processed: ' + counter;
    }

    if(action === 'dynamodbCreate') {
        const dynamodbAllFiles = await fs.readdir('./setup/dynamodb');
        const dynamodbSetupFiles = dynamodbAllFiles.filter(file => file.endsWith('.json'));
        status = 'dynamodb good';
    }

    return({action:action, status:status});
}

export const loader = async ({ params, request }) => {
    const mysqlSetupFiles = await fs.readdir('./setup/mysql');
    const dynamodbAllFiles = await fs.readdir('./setup/dynamodb');
    const dynamodbSetupFiles = dynamodbAllFiles.filter(file => file.endsWith('.json'));

    const stsClient = new STSClient({});
    const stsCommand = new GetCallerIdentityCommand({});
    const stsResponse = await stsClient.send(stsCommand);

    const ddbClient = new DynamoDBClient({});
    const ddbCommand = new DescribeEndpointsCommand({});
    const ddbResponse = await ddbClient.send(ddbCommand);

    return {
        mysqlSetupFiles:mysqlSetupFiles,
        dynamodbSetupFiles: dynamodbSetupFiles,
        stsResponse: stsResponse,
        ddbResponse: ddbResponse,
        params: params
    };

};

export default function Setup() {
    const data = useLoaderData();
    const actionData = useActionData();

    return(
        <div className="rootContainer">
        <Form id="jobForm" method="post"  >

            <Menu page='setup' />
            <br/>

            <table className='jobsBody'><tbody>
                <tr>
                    <td rowSpan='3' className='mysqlTitle'>MySQL</td>
                    <td>Create Table Commands<br/>
                        <span className='path'>database_app/setup/mysql/</span>
                    </td>
                    <td>Connection Details</td>
                </tr>
                <tr><td>
                    <table className='jobList'>
                        <tbody>
                        {data.mysqlSetupFiles.map((job,index) => {
                            return(<tr key={index}>
                                <td >{job}</td></tr>)
                        })}
                        </tbody>
                    </table>
                </td>
                <td>
                    <table className='mysqlConnectionInfo'>
                        <tbody>
                        <tr><td>Host</td><td>{config.host}</td></tr>
                        <tr><td>User</td><td>{config.user}</td></tr>
                        <tr><td>Database</td><td>{config.database}</td></tr>

                        </tbody>
                    </table>
                </td>
                </tr>
                <tr><td colSpan='2'>
                    <button type='submit' name='action' value='mysqlCreate' className='mysqlSetupButton'>
                        Create MySQL Tables</button>

                    <div className='createOutput'>
                        {actionData?.action === 'mysqlCreate' ? actionData.status: null}
                    </div>
                </td></tr>

                <tr><td className='tdBlank'>ee&nbsp;</td></tr>

                <tr>
                    <td rowSpan='3' className='dynamodbTitle'>DynamoDB</td>
                    <td>New Table Definitions<br/>
                    <span className='path'>database_app/setup/dynamodb/</span>
                    </td>
                    <td>Connection Details</td>
                </tr><tr>
                    <td>
                        <table className='jobList'>
                            <tbody>
                            {data.dynamodbSetupFiles.map((job,index) => {
                                const jobNameShort = job.slice(0, -3);
                                return(<tr key={index}>
                                    <td>{job}</td></tr>)
                            })}
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <table className='ddbConnectionInfo'>
                            <tbody>
                                <tr><td>Endpoint</td><td>{data.ddbResponse.Endpoints[0].Address}</td></tr>
                                <tr><td>User</td><td>{data.stsResponse.UserId}<br/>({data.stsResponse.Arn})</td></tr>

                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr><td colSpan='2'>
                    <button type='submit' name='action' value='dynamodbCreate' className='ddbSetupButton'>
                        Create DynamoDB Tables</button>
                    &nbsp;&nbsp;
                    <div className='createOutput'>
                        {actionData?.action === 'dynamodbCreate' ? actionData.status: null}
                    </div>
                </td></tr>

            </tbody></table>
        </Form>
        </div>
    );
}

