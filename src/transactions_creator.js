var aws = require('aws-sdk');
var ddb = new aws.DynamoDB({params: {TableName: 'snslambda'}});

exports.handler = function(event, ctx, callback){
    const data = event.Records[0].messageAttributes

    const params = {
      Item: {
        uuid: ctx.awsRequestID,
        kartica: data.kartica.stringValue,
        banka: data.banka.stringValue,
        iznos: data.iznos.stringValue,
        vrijeme: data.vrijeme.stringValue,
        status: data.status.stringValue,
        opis: data.opis.stringValue,
        raspolozivo: data.raspolozivo.stringValue,
      },
      TableName: 'transactions'
    };
    ddb.put(params, function(err, data){
      if(err){
          callback(err, null);
      }else{
          callback(null);
      }
  });
}
