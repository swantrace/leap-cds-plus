const { validateXacmlRequest } = require("../lib/validators");
const { asXacmlResponse } = require("../lib/consent-decision-xacml");
const { processDecision } = require("../lib/consent-processor");
const { fetchConsents } = require("../lib/consent-discovery");
const logger = require("../lib/logger");

async function post(req, res, next) {
  try {
    validateXacmlRequest(req);

    const context = xacmlRequestToContext(req.body);
    const category = context.category || [];

    const consentsBundle = await fetchConsents(context.patientId, category);
    const decisionEntry = await processDecision(consentsBundle, context);

    logger.debug(
      `Request: , Consents: ${consentsBundle.map(
        ({ fullUrl }) => fullUrl
      )}, Decision: ${JSON.stringify(decisionEntry)}`
    );

    res.send(asXacmlResponse(decisionEntry));
  } catch (e) {
    next(e);
  }
}

function attributeValueFromArray(attributeArray, attributeId) {
  const theAttribute = attributeArray.filter(
    ({ AttributeId }) => AttributeId === attributeId
  );
  return theAttribute?.[0]?.Value;
}

function xacmlRequestToContext(xacmlRequest) {
  const patientId = attributeValueFromArray(
    xacmlRequest?.Request?.Resource?.[0]?.Attribute,
    "patientId"
  );

  const category = attributeValueFromArray(
    xacmlRequest?.Request?.Action?.[0]?.Attribute,
    "category"
  );

  const purposeOfUse = attributeValueFromArray(
    xacmlRequest?.Request?.Action?.[0]?.Attribute,
    "purposeOfUse"
  );

  const actor = attributeValueFromArray(
    xacmlRequest?.Request?.AccessSubject?.[0]?.Attribute,
    "actor"
  );

  return {
    patientId,
    category,
    actor,
    purposeOfUse
  };
}

module.exports = {
  post
};
