import * as cognito from "aws-cdk-lib/aws-cognito";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { RemovalPolicy, Stack } from "aws-cdk-lib";

/**
 * CongnitoのUserPoolを作成する.
 * @param scope スタック
 * @param id 論理ID
 * @param props
 */
export const create = (scope: Stack, id: string) => {
  const { userPool } = createUserPool(scope, id);
  createUserPoolClient(id, userPool);
  //   createIdentityPool(scope, id, userPoolClient, userPool);

  return { userPool };
};

const createUserPool = (scope: Stack, id: string) => {
  const userPool = new cognito.UserPool(scope, id, {
    userPoolName: `${id}UserPool`,
    mfa: cognito.Mfa.OPTIONAL,
    selfSignUpEnabled: true,
    signInAliases: {
      email: true,
    },
    passwordPolicy: {
      minLength: 8,
      requireLowercase: true,
      requireUppercase: true,
      requireDigits: true,
    },
    removalPolicy: RemovalPolicy.DESTROY,
  });
  return { userPool };
};

const createUserPoolClient = (id: string, userPool: UserPool) => {
  const userPoolClient = userPool.addClient(`${id}Client`, {
    authFlows: {
      userPassword: true,
      userSrp: true,
    },
  });
  return { userPoolClient };
};

const createIdentityPool = (
  scope: Stack,
  id: string,
  userPoolClient: UserPoolClient,
  userPool: UserPool
) => {
  new cognito.CfnIdentityPool(scope, id, {
    allowUnauthenticatedIdentities: true,
    identityPoolName: `${id}IdentityPool`,
    cognitoIdentityProviders: [
      {
        clientId: userPoolClient.userPoolClientId,
        providerName: userPool.userPoolProviderName,
      },
    ],
  });
};
