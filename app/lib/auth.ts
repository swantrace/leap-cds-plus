const jwt = require("jsonwebtoken");
const superagent = require("superagent");
const CONSENT_FHIR_SERVERS = (process.env.CONSENT_FHIR_SERVERS || "")
  .split(",")
  .map((res) => res.trim());
const CONSENT_FHIR_SERVERS_AUTH = JSON.parse(
  process.env.CONSENT_FHIR_SERVERS_AUTH || "{}"
);

async function getGoogleAccessToken(clientEmail, privateKeyString) {
  const privateKey = Buffer.from(privateKeyString, "utf8");

  const now = Math.floor(Date.now() / 1000);
  const tokenRequest = jwt.sign(
    {
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/cloud-platform",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 60 * 5,
      iat: now
    },
    privateKey,
    { algorithm: "RS256" }
  );

  const res = await superagent
    .post("https://oauth2.googleapis.com/token")
    .type("form")
    .send({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer" })
    .send({ assertion: tokenRequest });

  const accessToken = res.body.access_token;
  return accessToken;
}

async function maybeAddAuth(request) {
  const token = await getAuth(request.url);
  if (token) {    
    return request.auth?.(token, { type: "bearer" });
  } else {
    return request;
  }
}

async function getAuth(fullUrl) {
  const fhirBase = getFhirBase(fullUrl);
  const authInfo = CONSENT_FHIR_SERVERS_AUTH[fhirBase];
  return authInfo?.type == "bearer"
    ? authInfo["auth_token"]
    : authInfo?.type == "google"
      ? getGoogleAccessToken(authInfo.client_email, authInfo.private_key)
      : null;
}

function getFhirBase(fullUrl) {
  return CONSENT_FHIR_SERVERS.filter((base) => fullUrl.startsWith(base))?.[0];
}

module.exports = { maybeAddAuth };
