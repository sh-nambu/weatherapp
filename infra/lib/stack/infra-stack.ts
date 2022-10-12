import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { InfraStackProps } from "../types";
import * as appsync from "../appsync";
import * as congnito from "../cognito"
import * as dynamodb from "../dynamodb"

/**
 * AWSリソースを作成するStack.
 */
export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: InfraStackProps) {
    super(scope, id, props);

    // Cognitoリソースを作成する
    const userPool = congnito.create(this, `${id}Cognito`)

    // AppSyncリソースを作成する
    const { attachLambdaResolver, attachDynamodbResolver } = appsync.create(this, `${id}AppSync`, userPool)

    // DynamoDBリソースを作成する
    dynamodb.create(this, `${id}Dynamodb`, {
      attachDynamodbResolver
    })

  }
}
