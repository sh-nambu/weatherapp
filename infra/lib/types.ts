import { StackProps } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { MappingTemplate } from "@aws-cdk/aws-appsync-alpha";

export type InfraStackProps = StackProps & {
  repo: { [key: string]: Repository };
  imageTag: { [key: string]: string };
  openWeatherMapApiKey: string;
};

export type WeatherInfoCreateProps = LambdaResolverAttachable & {
  image: Image;
  openWeatherMapApiKey: string;
};

export type AppsyncCreateProps = {
  userPool: UserPool;
};

export type DynamodbCreateProps = DynamodbResolverAttachable;

export type Image = {
  repository: Repository;
  tag: string;
};

export type LambdaResolverAttachable = {
  attachLambdaResolver: (
    dataSourceName: string,
    lambda: DockerImageFunction,
    operations: {
      typeName: string;
      fieldName: string;
      requestMappingTemplate?: MappingTemplate;
      responseMappingTemplate?: MappingTemplate;
    }[]
  ) => void;
};

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
