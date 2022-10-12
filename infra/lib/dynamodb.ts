import {
  MappingTemplate,
  PrimaryKey,
  Values,
} from "@aws-cdk/aws-appsync-alpha";
import { Stack, aws_dynamodb, RemovalPolicy, Duration } from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  AwsSdkCall,
  PhysicalResourceId,
} from "aws-cdk-lib/custom-resources";
import { DynamodbCreateProps } from "./types";

/**
 * Dynamodbのテーブルを作成する.
 * @param scope スタック
 * @param id 論理ID
 * @param props
 */
export const create = (
  scope: Stack,
  id: string,
  props: DynamodbCreateProps
) => {
  const tableName = `${id}Destinations`;
  const table = new aws_dynamodb.Table(scope, `${tableName}Table`, {
    tableName: tableName,
    removalPolicy: RemovalPolicy.DESTROY,
    partitionKey: { name: "id", type: aws_dynamodb.AttributeType.STRING },
  });

  const awsSdkCall: AwsSdkCall = {
    service: "DynamoDB",
    action: "batchWriteItem",
    physicalResourceId: PhysicalResourceId.of(`${tableName}Insert`),
    parameters: {
      RequestItems: {
        [tableName]: DESTINATIONS_REQUEST,
      },
    },
  };

  // dynamodbテーブルにレコードを挿入する
  new AwsCustomResource(scope, `${tableName}InitTable`, {
    onCreate: awsSdkCall,
    onUpdate: awsSdkCall,
    policy: AwsCustomResourcePolicy.fromStatements([
      new PolicyStatement({
        sid: "DynamoWriteAccess",
        effect: Effect.ALLOW,
        actions: ["dynamodb:BatchWriteItem"],
        resources: [table.tableArn],
      }),
    ]),
    timeout: Duration.minutes(5),
  });

  // dynamodbテーブルをResolverとしてQraphQLにアタッチする
  props.attachDynamodbResolver("destinations", table, [
    {
      typeName: "Query",
      fieldName: "getAllDestinations",
      requestMappingTemplate: MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: MappingTemplate.dynamoDbResultList(),
    },
    {
      typeName: "Mutation",
      fieldName: "addDestination",
      requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
        PrimaryKey.partition("id").auto(),
        Values.projecting("input")
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    },
  ]);
};

/**
 * テーブル初期状態.
 */
const DESTINATIONS_REQUEST = [
  {
    PutRequest: {
      Item: {
        id: { S: "a5210bf8-3642-40ac-b68a-05fe0ac0xxxx" },
        city: { S: "New York" },
        state: { S: "New York" },
        zip: { S: "10118" },
        description: { S: "Empire State Building" },
      },
    },
  },
  {
    PutRequest: {
      Item: {
        id: { S: "b7214nf8-4242-40nc-b68a-15f212xxxxx" },
        city: { S: "Orlando" },
        state: { S: "Florida" },
        zip: { S: "32830" },
        description: { S: "Disney World" },
      },
    },
  },
  {
    PutRequest: {
      Item: {
        id: { S: "c3114nf8-5212-30nc-3d8a-yhf21cxxxxx" },
        city: { S: "Paradise" },
        state: { S: "Nevada" },
        zip: { S: "89109" },
        description: { S: "Las Vegas Strip" },
      },
    },
  },
  {
    PutRequest: {
      Item: {
        id: { S: "d5113ma8-5512-60yc-3a5a-whf21zxxxxx" },
        city: { S: "Philadelphia" },
        state: { S: "Pennsylvania" },
        zip: { S: "19106" },
        description: { S: "Liberty Bell" },
      },
    },
  },
  {
    PutRequest: {
      Item: {
        id: { S: "e7813kl8-8512-61cc-2q5a-poc33cxxxxx" },
        city: { S: "Yellowstone" },
        state: { S: "Wyoming" },
        zip: { S: "82190" },
        description: { S: "Yellowstone National Park" },
      },
    },
  },
];
