import { aws_ecr, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";

/**
 * ECRのレポジトリを作成する.
 * @param scope コンストラクト
 * @param id 論理ID
 */
export const create = (scope: Construct, id: string) => ({
  weatherInfo: new aws_ecr.Repository(scope, `${id}Repository`, {
    repositoryName: "weather-info-function-image",
    removalPolicy: RemovalPolicy.DESTROY,
  }),
});
