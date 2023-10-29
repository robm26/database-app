import mysql from "mysql2/promise";
import {config} from "./mysql-credentials.mjs";

const runSql = async (sql) => {

    let result;
    let latency = 0;

    try {
        const connection = await mysql.createConnection(config);

        const timeStart = new Date();
        const [rows, fields] = await connection.execute(sql);
        const timeEnd = new Date();
        const timeDiff = timeEnd - timeStart;
        latency = timeDiff;
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

export {runSql};


