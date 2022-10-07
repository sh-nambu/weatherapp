import * as cdk from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { Construct } from "constructs";
import * as repository from "../repository";

/**
 * ECRのレポジトリを作成するStack.
 */
export class EcrStack extends cdk.Stack {
  readonly #repo: { [key: string]: Repository };
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    this.#repo = repository.create(this, id);
  }
  get repo() {
    return this.#repo;
  }
}
