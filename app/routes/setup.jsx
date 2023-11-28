
import {Menu} from "~/components/menu";
import React from "react";
import * as fs from 'node:fs/promises';
import { useActionData, useLoaderData, Form, Link} from "@remix-run/react";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { DynamoDBClient, DescribeEndpointsCommand, CreateTableCommand, DeleteTableCommand, ListTablesCommand} from "@aws-sdk/client-dynamodb";
import { config } from "../components/mysql-credentials.mjs";
import { runSql } from "../components/database.mjs";


export async function action({ params, request }) {
    const body = await request.formData();
    const action = body.get("_action");
    console.log('\naction ' + action);
    console.log('body ' + JSON.stringify(body, null, 2));

    let dbEngine;
    let fileContents;
    let fileContentsObj = {}
    let status;
    let errors = [];

    if(action === 'mysqlCreate') {
        const mysqlSetupFiles = await fs.readdir('./setup/mysql');
        let counter = 0;
        for (const file of mysqlSetupFiles) {
            let sql = 'DROP TABLE IF EXISTS ' + file.slice(0, -4) + ';';
            let result = await runSql(sql);

            sql = await fs.readFile('./setup/mysql/' + file, 'utf-8');
            result = await runSql(sql);
            counter += 1;
        }
        status = 'processed: ' + counter;
    }

    if(action === 'dynamodbCreate') {
        const ddbClient = new DynamoDBClient({});

        const dynamodbAllFiles = await fs.readdir('./setup/dynamodb');
        const dynamodbSetupFiles = dynamodbAllFiles.filter(file => file.endsWith('.json'));
        let counter = 0;
        for (const file of dynamodbSetupFiles) {
            const newTableJson = await fs.readFile('./setup/dynamodb/' + file, 'utf-8');
            const ddbCommand = new CreateTableCommand(JSON.parse(newTableJson));

            let ddbResponse;

            try {
                ddbResponse = await ddbClient.send(ddbCommand);
            } catch (error) {
                error['table'] = JSON.parse(newTableJson).TableName;
                errors.push(error);
            } finally {
                counter += 1;
            }
        }
        status = 'processed: ' + counter;
    }

    if(['.sql', 'json'].includes(action?.slice(-4)) ) {
        let dbFilename;
        if(action?.slice(-4) === '.sql') {
            dbEngine = 'mysql';
            dbFilename = './setup/mysql/' + action;
            fileContents = await fs.readFile(dbFilename, 'utf-8');
            fileContentsObj['mysql'] = fileContents;

        } else {
            dbEngine = 'dynamodb';
            dbFilename = './setup/dynamodb/' + action;
            fileContents = await fs.readFile(dbFilename, 'utf-8');
            fileContentsObj['dynamodb'] = fileContents;
        }
    }

    return({
        action:action,
        dbEngine:dbEngine,
        fileContentsMysql: fileContentsObj['mysql'],
        fileContentsDynamodb: fileContentsObj['dynamodb'],
        status:status,
        errors:errors});
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

    const mySqlHostSegments = config.host.split('.');
    const mySqlHost = (<span>{mySqlHostSegments.slice(0,2).join('.')}<br/>.{mySqlHostSegments.slice(2).join('.')}</span>);

    return(
        <div className="rootContainer">
        <Form id="jobForm" method="post"  >

            <Menu page='setup' />
            <br/>

            <table className='jobsBody'><tbody>
                <tr>
                    <td className='mysqlTitle'>MySQL</td>

                    <td>Create Table Commands<br/>
                        <span className='path'>database_app/setup/mysql/</span>
                    </td>
                    <td>Table Details<br/>

                    </td>
                </tr>
                <tr>
                    <td rowSpan='2' >
                        Connection Details
                        <details>
                            <summary>
                                <span className='path'>/app/components/mysql-credentials.mjs</span>
                            </summary>
                            <br/>
                            <table className='mysqlConnectionInfo'>
                                <tbody>
                                <tr><td>Host</td><td className='path'>{mySqlHost}</td></tr>
                                <tr><td>User</td><td>{config.user}</td></tr>
                                <tr><td>Database</td><td>{config.database}</td></tr>

                                </tbody>
                            </table>
                        </details>
                    </td>
                    <td>
                    <table className='jobList'>
                        <tbody>
                        {data.mysqlSetupFiles.map((table,index) => {
                            return(<tr key={index}>
                                <td >
                                    <button type='submit' name='_action' value={table} className='setupTableButton'>
                                        {table}</button>
                                </td></tr>)
                        })}
                        </tbody>
                    </table>
                </td>
                <td>
                    <div >
                        <div className={'setupFileContents'}>
                                <pre id="json">
                                    {actionData?.fileContentsMysql}
                                </pre>
                        </div>

                    </div>
                </td>
                </tr>
                <tr><td colSpan='2'>
                    <button type='submit' name='_action' value='mysqlCreate' className='mysqlSetupButton'>
                        Create MySQL Tables</button>

                    <div className='createOutput'>
                        {actionData?.action === 'mysqlCreate' ? actionData.status: null}
                    </div>
                </td></tr>

                <tr><td className='tdBlank'>&nbsp;</td></tr>

                <tr>
                    <td className='dynamodbTitle'>DynamoDB</td>
                    <td>New Table Definitions<br/>
                    <span className='path'>database_app/setup/dynamodb/</span>
                    </td>
                    <td>Table Details<br/>

                    </td>
                </tr><tr>
                    <td rowSpan='2'>
                        Connection Details

                        <details>
                            <summary>
                                <span className='path'>IAM Identity set in shell environment</span>
                                <br/>
                            </summary>
                            <br/>

                            <table className='ddbConnectionInfo'>
                                <tbody>
                                <tr><td>Endpoint</td><td className='path'>{data.ddbResponse.Endpoints[0].Address}</td></tr>
                                <tr><td>User</td><td>{data.stsResponse.UserId}<br/>({data.stsResponse.Arn})</td></tr>
                                </tbody>
                            </table>
                        </details>
                    </td>
                    <td>
                        <table className='jobList'>
                            <tbody>
                            {data.dynamodbSetupFiles.map((table,index) => {

                                return(<tr key={index}>
                                    <td>
                                        <button type='submit' name='_action' value={table} className='setupTableButton'>
                                        {table}</button>
                                    </td></tr>)
                            })}
                            </tbody>
                        </table>
                    </td>
                    <td>
                        {actionData?.dbEngine !== 'dynamodb' ? null : (
                            <div className={'setupFileContents'}>
                                <pre id="json">
                                    {actionData?.fileContentsDynamodb.trim()}
                                </pre>
                            </div>
                        )}
                    </td>
                </tr>
                <tr><td colSpan='2'>
                    <button type='submit' name='_action' value='dynamodbCreate' className='ddbSetupButton'>
                        Create DynamoDB Tables</button>
                    &nbsp;&nbsp;
                    <div className='createOutput'>
                        {actionData?.action === 'dynamodbCreate' ? (
                            <div>
                                {actionData.errors.map((err, index) => {
                                    return (<div key={index}>
                                        HTTP {err.$metadata.httpStatusCode} {err.name} {err.table}<br/>
                                    </div>);
                                })}
                                {actionData.status}
                            </div>
                        ): null}
                    </div>
                </td></tr>

            </tbody></table>
        </Form>
        </div>
    );
}

