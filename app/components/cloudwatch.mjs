import { CloudWatchClient, GetMetricDataCommand } from "@aws-sdk/client-cloudwatch";

export const getData = async (req) => {

    const queries = [{
        "Id": "w",
        "MetricStat": {
            "Metric": {
                "Namespace": "AWS/DynamoDB",
                "MetricName": "ConsumedWriteCapacityUnits",
                "Dimensions": [{"Name": "TableName", "Value": req.TableName}]
            },
            "Period": 60,
            "Stat": "Sum",
            "Unit": "Count"
        },
        "ReturnData": true,
    },
        {
            "Id": "r",
            "MetricStat": {
                "Metric": {
                    "Namespace": "AWS/DynamoDB",
                    "MetricName": "ConsumedReadCapacityUnits",
                    "Dimensions": [{"Name": "TableName", "Value": req.TableName}]
                },
                "Period": 60, "Stat": "Sum", "Unit": "Count"
            },
            "ReturnData": true,
        },
        {
            "Id": "tw",
            "MetricStat": {
                "Metric": {
                    "Namespace": "AWS/DynamoDB",
                    "MetricName": "WriteThrottleEvents",
                    "Dimensions": [{"Name": "TableName", "Value": req.TableName}]
                },
                "Period": 60,
                "Stat": "Sum",
                "Unit": "Count"
            },
            "ReturnData": true,
        }
    ];
    const minutesBack = 5;

    const StartDate = Date.now() - (minutesBack * 60 * 1000);
    const EndDate = Date.now();

    const params = {
        "Region": "us-east-1",
        "MetricDataQueries" : queries,
        "StartTime": new Date(StartDate),
        "EndTime":   new Date(EndDate)
    };

    //{region: us-east-1}
    const cwClient = new CloudWatchClient({region:'us-east-1'});
    const command = new GetMetricDataCommand(params);
    const response = await cwClient.send(command);

    return response;

};


