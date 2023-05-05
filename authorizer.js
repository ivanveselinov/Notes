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

exports.handler = (event, context, cb) => {
  // lambda authorized code
  let token = event.authorizationToken; // "allow or deny"

  switch (token) {
    case "allow":
      cb(null, generatePolicy("user", "Allow", event.methodArn));
      break;

    case "deny":
      cb(null, generatePolicy("user", "Deny", event.methodArn));
      break;
    default:
      cb("Error: Invalid token");
  }
};
