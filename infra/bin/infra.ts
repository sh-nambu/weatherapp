import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { InfraStack } from "../lib/stack/infra-stack";
import * as dotenv from "dotenv";
import { EcrStack } from "../lib/stack/ecr-stack";

/**
 * CDKアプリケーションへのエントリポイント.
 * lib/* で定義したすべてのスタックがロードされる.
 */

const app = new cdk.App();

// .envファイルを読み込む
dotenv.config({ override: true });

// ECRのスタックを作成する
const ecrStack = new EcrStack(app, "EcrStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

// ECR以外のスタックを作成する
new InfraStack(app, "InfraStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  repo: ecrStack.repo,
  imageTag: {
    weatherInfo: "latest",
  },
  openWeatherMapApiKey: process.env.OPEN_WEATHER_MAP_API_KEY ?? "",
});
