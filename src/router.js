 
const AWS = require("aws-sdk");
const sqs = new AWS.SQS({
    region: "eu-central-1",
});
exports.handler = (e, ctx, callback) => {
    console.info(e);
    const accountId = ctx.invokedFunctionArn.split(":")[4];
    const queueUrlhb = `https://sqs.eu-central-1.amazonaws.com/${accountId}/hb_message_processing_queue`;
    const queueUrlnlb = `https://sqs.eu-central-1.amazonaws.com/${accountId}/nlb_message_processing_queue`;
    // response i status za http endpoint 
    const responseBody = {
        message: ""
    };
    let responseCode = 200;
    const data = JSON.parse(e.body);
    const nlb = data.message.includes("NLB");
    const hipotekarna = data.message.includes("Hipotekarna");
    
    if (hipotekarna==true){
        const params = {
            MessageBody: e.body,
            QueueUrl: queueUrlhb,
        };

        sqs.sendMessage(params, (err, data) => {
            if (err) {
                console.info("error:", `neuspjesno, problem sa serverom ${err}`);
                responseCode = 500;
            } else {
                console.info("data:", data.MessageId);
                responseBody.message = `Uspjesno poslato u hb_message_processing_queue`;
                responseBody.messageId = data.MessageId;
            }
        });
        const response = {
            statusCode: responseCode,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(responseBody),
        };
        callback(null, response);
    }

    else if(nlb==true){
        const params = {
            MessageBody: e.body,
            QueueUrl: queueUrlnlb,
        };

        sqs.sendMessage(params, (err, data) => {
            if (err) {
                console.info("error:", `neuspjesno poslato,serverska greska${err}`);
                responseCode = 500;
            } else {
                console.info("data:", data.MessageId);
                responseBody.message = `poslato u nlb_message_processing_queue`;
                responseBody.messageId = data.MessageId;
            }
        });
        const response = {
            statusCode: responseCode,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(responseBody),
        };
        callback(null, response);
    }

};

