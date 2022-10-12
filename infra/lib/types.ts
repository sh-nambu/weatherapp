import { StackProps } from "aws-cdk-lib";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { MappingTemplate } from "@aws-cdk/aws-appsync-alpha";
export type AppsyncCreateProps = {
  userPool: UserPool;
};

export type DynamodbCreateProps = DynamodbResolverAttachable;

export type DynamodbResolverAttachable = {
  attachDynamodbResolver: (
    dataSourceName: string,
    table: Table,
    operations: {
      typeName: string;
      fieldName: string;
      requestMappingTemplate?: MappingTemplate;
      responseMappingTemplate?: MappingTemplate;
    }[]
  ) => void;
};
