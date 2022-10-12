import { MappingTemplate } from "@aws-cdk/aws-appsync-alpha";
import { aws_lambda, Stack } from "aws-cdk-lib";
import { WeatherInfoCreateProps } from "./types";

/**
 * Lambda関数を作成する.
 * @param scope スタック
 * @param id 論理ID
 * @param props
 */
export const create = (
  scope: Stack,
  id: string,
  props: WeatherInfoCreateProps
) => {
  const lambda = new aws_lambda.DockerImageFunction(scope, id, {
    // ECRのレポジトリにあるイメージを指定
    code: aws_lambda.DockerImageCode.fromEcr(props.image.repository, {
      tagOrDigest: props.image.tag,
    }),
    environment: {
      API_KEY: props.openWeatherMapApiKey,
    },
    architecture: aws_lambda.Architecture.ARM_64,
  });
  // Lambda関数をResolverとしてQraphQLAPIにアタッチする
  props.attachLambdaResolver("weatherInfo", lambda, [
    {
      typeName: "Destination",
      fieldName: "conditions",
      requestMappingTemplate: MappingTemplate.fromString(
        `{
          "version": "2017-02-28",
          "operation": "Invoke",
          "payload": {
            "city":\$util.toJson(\$context.source.city)
          }
        }`
      ),
      responseMappingTemplate: MappingTemplate.lambdaResult(),
    },
  ]);
};
