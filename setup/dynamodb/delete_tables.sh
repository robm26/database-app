REGION=us-east-1
ENDPOINTURL=https://dynamodb.$REGION.amazonaws.com
# ENDPOINTURL=http://localhost:8000

OUTPUT=text

TableList=("customers" "products" "cities" "events" "events_indexed" "everysize")
TableName=""

if [ $# -gt 0 ]
  then
    TableName=$1
    aws dynamodb delete-table --table-name $1 --region $REGION --endpoint-url $ENDPOINTURL --output $OUTPUT --query 'TableDescription.TableArn'
  else
    for TableName in "${TableList[@]}"
    do
          aws dynamodb delete-table --table-name $TableName --region $REGION --endpoint-url $ENDPOINTURL --output $OUTPUT --query 'TableDescription.TableArn'
    done
fi

echo Table deletion in process, please wait...
# await final table deletion
aws dynamodb wait table-not-exists --table-name $TableName --region $REGION --endpoint-url $ENDPOINTURL

