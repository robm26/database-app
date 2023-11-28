REGION=us-east-1

ENDPOINTURL=https://dynamodb.$REGION.amazonaws.com
# ENDPOINTURL=http://localhost:8000
OUTPUT=text

TableList=("customers" "products" "cities" "events" "events_indexed" )
TableName=""

if [ $# -gt 0 ]
  then
    aws dynamodb create-table --cli-input-json "file://$1.json" --region $REGION --endpoint-url $ENDPOINTURL --output $OUTPUT --query 'TableDescription.TableArn'
  else
    for TableName in "${TableList[@]}"
    do
        aws dynamodb create-table --cli-input-json file://$TableName.json --region $REGION --endpoint-url $ENDPOINTURL --output $OUTPUT --query 'TableDescription.TableArn'
    done

fi

