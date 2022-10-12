import * as appsync from "@aws-cdk/aws-appsync-alpha";
import { AppsyncCreateProps } from "./types";
import { DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import { Stack } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { MappingTemplate } from "@aws-cdk/aws-appsync-alpha";

/**
 * AppSyncでGraphQLAPIを作成する.
 * @param scope スタック
 * @param id 論理ID
 * @param props
 */
export const create = (scope: Stack, id: string, props: AppsyncCreateProps) => {
  const graphqlApi = new appsync.GraphqlApi(scope, id, {
    name: id,
    schema: appsync.Schema.fromAsset("../schema.graphql"),
    authorizationConfig: {
      defaultAuthorization: {
        authorizationType: appsync.AuthorizationType.USER_POOL,
        userPoolConfig: {
          userPool: props.userPool,
        },
      },
    },
  });

  const attachLambdaResolver = (
    dataSourceName: string,
    lambda: DockerImageFunction,
    operations: {
      typeName: string;
      fieldName: string;
      requestMappingTemplate?: MappingTemplate;
      responseMappingTemplate?: MappingTemplate;
    }[]
  ) => {
    const dataSource = graphqlApi.addLambdaDataSource(dataSourceName, lambda);
    operations.forEach(
      ({
        typeName,
        fieldName,
        requestMappingTemplate,
        responseMappingTemplate,
      }) => {
        dataSource.createResolver({
          typeName,
          fieldName,
          requestMappingTemplate,
          responseMappingTemplate,
        });
      }
    );
  };

  const attachDynamodbResolver = (
    dataSourceName: string,
    table: Table,
    operations: {
      typeName: string;
      fieldName: string;
      requestMappingTemplate?: MappingTemplate;
      responseMappingTemplate?: MappingTemplate;
    }[]
  ) => {
    const dataSource = graphqlApi.addDynamoDbDataSource(dataSourceName, table);
    operations.forEach(
      ({
        typeName,
        fieldName,
        requestMappingTemplate,
        responseMappingTemplate,
      }) => {
        dataSource.createResolver({
          typeName,
          fieldName,
          requestMappingTemplate,
          responseMappingTemplate,
        });
      }
    );
  };

  return { attachLambdaResolver, attachDynamodbResolver };
};
