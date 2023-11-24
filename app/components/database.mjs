import mysql from "mysql2/promise";
import {config} from "./mysql-credentials.mjs";

import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {ExecuteStatementCommand, DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const runPartiQL = async (sql) => {

    let latency = 0;
    let response;
    let timeStart;
    let timeEnd;

    let operation = (sql).trim().split(" ")[0].toLowerCase();

    const command = new ExecuteStatementCommand({
        Statement: sql,
        Parameters: [false],
        ConsistentRead: false,
        ReturnConsumedCapacity: "TOTAL"
    });

    try{
        timeStart = new Date();
        response = await docClient.send(command);

    }  catch (error) {
        timeEnd = new Date();
        latency = timeEnd - timeStart;
        const errorSummary = {
            error: {
                message: error.name,
                code:'http ' + error.$metadata.httpStatusCode
                // name: error.name,
                // fault: error.$fault,
                // httpStatusCode: error.$metadata.httpStatusCode,
                // requestId: error.$metadata.requestId,
                // attempts: error.$metadata.attempts,
                // totalRetryDelay: error.$metadata.totalRetryDelay
            },
            affectedRows: 0
        };
        console.log(sql);

        console.log(JSON.stringify(error, null, 2));

        return({result:errorSummary, latency:latency, operation: operation});
    }

    timeEnd = new Date();
    latency = timeEnd - timeStart;

    response['affectedRows'] = 1;

    return({result:response, latency:latency, operation: operation});

};

const runSql = async (sql) => {

    let result;
    let timeStart;
    let timeEnd;
    let latency = 0;
    let operation = (sql).trim().split(" ")[0].toLowerCase();

    try {
        const connection = await mysql.createConnection(config);

        timeStart = new Date();

        const [rows, fields] = await connection.execute(sql);

        timeEnd = new Date();
        latency = timeEnd - timeStart;

        if(Array.isArray(rows)) {
            result = {'Items': rows};
        } else {
            result = rows;
        }

        await connection.end();

    }  catch (error) {
        timeEnd = new Date();
        latency = timeEnd - timeStart;
        console.log(JSON.stringify(error, null, 2));
        result = {
            error:error
        };
    }

    return({result:result, latency:latency, operation: operation});
}


export {runSql, runPartiQL};

