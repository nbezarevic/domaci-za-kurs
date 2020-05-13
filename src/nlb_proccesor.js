const AWS = require('aws-sdk');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const queueUrl = `https://sqs.eu-central-1.amazonaws.com/${accountId}/parsed_message`;
exports.handler('/parsed_message', (req, res) => {

    let sqsnlb = {
        'kartica': req.body['kartica'],
        'banka': req.body['banka'],
        'iznos': req.body['iznos'],
        'vrijeme': req.body['vrijeme'],
        'status': req.body['status'],
        'opis': req.body['opis'],
        'raspolozivo': req.body['raspolozivo']
    }

    let sqsparsed = {
        MessageAttributes: {
          "kartica": {
            DataType: "String",
            StringValue: sqsnlb.kartica
          },
          "banka": {
            DataType: "String",
            StringValue: sqsnlb.banka
          },
          "iznos": {
            DataType: "String",
            StringValue: sqsnlb.iznos
          },
          "vrijeme": {
            DataType: "String",
            StringValue: sqsnlb.vrijeme
          },
          "status": {
            DataType: "String",
            StringValue: sqsnlb.status
          },
          "opis": {
            DataType: "String",
            StringValue: sqsnlb.opis
          },
          "raspolozivo": {
            DataType: "String",
            StringValue: sqsnlb.raspolozivo
          }
        },
        MessageBody: JSON.stringify(sqsnlb),
        QueueUrl: queueUrl
    };

    // Send the order data to the SQS queue
    let sendSqsMessage = sqs.sendMessage(sqsparsed).promise();

    sendSqsMessage.then((data) => {
        console.log(`uspjesno poslato u sqsparsed: ${data.MessageId}`);
    }).catch((err) => {
        console.log(`neuspjesno poslato ${err}`);
    });
});