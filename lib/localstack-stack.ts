import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";

export class LocalstackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const testBucket = new s3.Bucket(this, "TestBucket", {
      bucketName: "test-bucket",
    });

    const testFunction = new lambdaNodejs.NodejsFunction(this, "TestFunction", {
      entry: "src/main.ts",
      handler: "handler",
      environment: {
        BUCKET_NAME: testBucket.bucketName,
      },
      functionName: "test-function",
    });
    testFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["s3:PutObject"],
        resources: [testBucket.bucketArn, `${testBucket.bucketArn}/*`],
      })
    );

    new logs.LogGroup(this, "LogGroup", {
      logGroupName: `/aws/lambda/${testFunction.functionName}`,
    });
  }
}
