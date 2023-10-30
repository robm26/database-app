import {runSql, runPartiQL} from "./database.mjs";

let sql = "select * from users where user_id = '1000' ";
// sql = 'insert into customers (customer_id, customer_name) values ("777", "Luna")';

let result;

const run = async (sql) => {

    // result = await runSql(sql);
    result = await runPartiQL(sql);

    console.log(result);

}

void run(sql).then(()=>{
    process.exit(1);
});

