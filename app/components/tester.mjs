import {runSql, runPartiQL} from "./database.mjs";
import {getData} from './cloudwatch.mjs'

const cwData = getData({TableName:'products'});
console.log('cwData');

// console.log(JSON.stringify(cwData, null, 2));

let sql;

sql = "select * from events_indexed ";

sql = "INSERT INTO events_indexed VALUE {" +
    "    'event_id':'e0022'," +
    "    'product':'Skateboard'," +
    "    'rating':636," +
    "    'status':'ACTIVE'," +
    "    'balance':133," +
    "    'last_updated':'2023-11-22'" +
    "};";

// sql = 'insert into users (user_id, firstname, lastname, city) values ("333", "Taddy", "Fish", "Wakefield")';
// let sql = "update users set credit_rating = 700 where user_id = '1000'";

// sql = "  update users set credit_rating = 337 where user_id = '1000' ";
// sql = "DROP TABLE IF EXISTS customers;";

// console.log(sql);
// console.log(Math.random());


let db = 'dynamodb';

if (process.argv.length > 2) {
    db = process.argv[2];
}

let result;

const run = async (sql) => {

    if(db === 'dynamodb') {
        result = await runPartiQL(sql);
    }
    if(db === 'mysql') {
        result = await runSql(sql);
    }

    console.log(JSON.stringify(result, null, 2));

}

void run(sql).then(()=>{
    process.exit(1);
});

