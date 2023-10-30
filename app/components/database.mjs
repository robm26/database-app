import mysql from "mysql2/promise";
import {config} from "./mysql-credentials.mjs";

import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {ExecuteStatementCommand, DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const runSql = async (sql) => {

    let result = [];
    let latency = 0;

    try {
        const connection = await mysql.createConnection(config);

        const timeStart = new Date();

        const [rows, fields] = await connection.execute(sql);

        const timeEnd = new Date();
        latency = timeEnd - timeStart;

        result = rows;
        await connection.end();

    }  catch (error) {

        console.log(JSON.stringify(error, null, 2));
        result = {
            error:error
        };
    }
    return({result:result, latency:latency});
}
const runPartiQL = async (sql) => {

    let latency = 0;

    const command = new ExecuteStatementCommand({
        Statement: sql,
        Parameters: [false],
        ConsistentRead: false,
    });

    const timeStart = new Date();

    const response = await docClient.send(command);

    const timeEnd = new Date();
    latency = timeEnd - timeStart;

    return({result:response['Items'], latency:latency});

};

export {runSql, runPartiQL};


