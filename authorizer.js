const { CognitoJwtVerifier } = require("aws-jwt-verify"); // Install token verifier via npm i aws-jwt-verify
const COGNITO_USERPOOL_ID = process.env.COGNITO_USERPOOL_ID;
const COGNITO_WEB_CLIENT_ID = process.env.COGNITO_WEB_CLIENT_ID;

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USERPOOL_ID,
  tokenUse: "id",
  clientId: COGNITO_WEB_CLIENT_ID
});

const generatePolicy = (principalId, effect, resource) => {
  let authResponse = {};

  authResponse.principalId = principalId;

  if (effect && resource) {
    let policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: effect,
          Resource: resource,
          Action: "execute-api:Invoke"
        }
      ]
    };
    authResponse.policyDocument = policyDocument;
  }
  authResponse.context = {
    foo: "bar"
  };
  console.log(JSON.stringify(authResponse));
  return authResponse;
};

exports.handler = async (event, context, cb) => {
  // lambda authorized code
  let token = event.authorizationToken; // "allow or deny"
  console.log(token);

  // Validate the token
  try {
    const payload = await jwtVerifier.verify(token); // Pass the token
    console.log(JSON.stringify(payload));
    cb(null, generatePolicy("user", "Allow", event.methodArn));
  } catch (err) {
    cb("Error: Invalid token");
  }
};
