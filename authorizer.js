const { CognitoJwtVerifier } = require("aws-jwt-verify"); // Install token verifier via npm i aws-jwt-verify

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: "ap-southeast-2_EExi0IXBz",
  tokenUse: "id",
  clientId: "4ri6gcup5n2bh9o62rut84ho0e"
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
