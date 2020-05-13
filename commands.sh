#make bucket
aws s3 mb s3://bucketzadomaci

#package files
aws cloudformation package --template-file template.yaml --s3-bucket bucketzadomaci --output-template-file gen/generated-template.yaml

#deploy files

aws cloudformation deploy --template-file C:\Users\Administrator\Desktop\aws\gen\generated-template.yaml --stack-name domacinsk --capabilities CAPABILITY_IAM