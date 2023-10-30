REGION=us-east-1

ENDPOINTURL=https://dynamodb.$REGION.amazonaws.com
# ENDPOINTURL=http://localhost:8000
OUTPUT=text


if [ $# -gt 0 ]
  then
    aws dynamodb create-table --cli-input-json "file://$1.json" --region $REGION --endpoint-url $ENDPOINTURL --output $OUTPUT --query 'TableDescription.TableArn'
  else

    aws dynamodb create-table --cli-input-json file://table1.json --region $REGION --endpoint-url $ENDPOINTURL --output $OUTPUT --query 'TableDescription.TableArn'
    aws dynamodb create-table --cli-input-json file://table2.json --region $REGION --endpoint-url $ENDPOINTURL --output $OUTPUT --query 'TableDescription.TableArn'
    aws dynamodb create-table --cli-input-json file://table3.json --region $REGION --endpoint-url $ENDPOINTURL --output $OUTPUT --query 'TableDescription.TableArn'

fi

