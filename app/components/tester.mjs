import {runSql} from "./database.mjs";

let sql = 'select * from customers limit 2';
// sql = 'insert into customers (customer_id, customer_name) values ("777", "Luna")';

const run = async (sql) => {

    const result = await runSql(sql);
    console.log(result);

}

void run(sql).then(()=>{
    process.exit(1);
});

