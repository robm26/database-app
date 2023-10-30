REGION=us-east-1
ENDPOINTURL=https://dynamodb.$REGION.amazonaws.com
# ENDPOINTURL=http://localhost:8000

OUTPUT=text

if [ $# -gt 0 ]
  then
    aws dynamodb delete-table --table-name $1 --region $REGION --endpoint-url $ENDPOINTURL --output $OUTPUT --query 'TableDescription.TableArn'
  else
     aws dynamodb delete-table --table-name table1 --region $REGION --endpoint-url $ENDPOINTURL --output $OUTPUT --query 'TableDescription.TableArn'
     aws dynamodb delete-table --table-name table2 --region $REGION --endpoint-url $ENDPOINTURL --output $OUTPUT --query 'TableDescription.TableArn'
     aws dynamodb delete-table --table-name table3 --region $REGION --endpoint-url $ENDPOINTURL --output $OUTPUT --query 'TableDescription.TableArn'

fi
