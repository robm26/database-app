import { DynamoDBClient, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

if (process.argv.length < 3) {
    console.error('Which table to truncate?');
    process.exit(1);
}

const tableName = process.argv[2];

export const main = async () => {
    const metadatacommand = new DescribeTableCommand({TableName: tableName});
    const metadata = await client.send(metadatacommand);
    const table = metadata.Table;
    const KS = table.KeySchema;
    const ADS = table.AttributeDefinitions;
    // console.log(KS);

    const PK = KS.filter(key=> key.KeyType === 'HASH')[0].AttributeName;
    const SK = KS.filter(key=> key.KeyType === 'RANGE')[0]?.AttributeName;

    const scancommand = new ScanCommand({TableName: tableName});

    const response = await docClient.send(scancommand);
    const items = response?.Items;
    let counter = 0;
    for (const item of items) {
        counter += 1;

        let primaryKey = {};
        primaryKey[PK] = item[PK];

        if(SK) {
            primaryKey[SK] = item[SK];
        }
        let dparams = {
            TableName: tableName,
            Key: primaryKey
        };

        const deletecommand = new DeleteCommand(dparams);
        const response = await docClient.send(deletecommand);

    }
    console.log('deleted ' + counter + ' items from table ' + tableName);

    return response;
};

(async() => {
    const runResult = await main();

})()
