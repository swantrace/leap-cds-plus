import Ajv from "ajv";

const ajv = new Ajv();

import consentDecisionHookRequestSchema from "../schemas/patient-consent-consult-hook-request.schema.json";
const consentDecisionHookRequestValidator = ajv.compile(
  consentDecisionHookRequestSchema
);

import xacmlRequestSchema from "../schemas/xacml-request.schema.json";
const xacmlRequestValidator = ajv.compile(xacmlRequestSchema);

import slsRequestSchema from "../schemas/sls-request.schema.json";
const slsRequestValidator = ajv.compile(slsRequestSchema);

import slsHookRequestSchema from "../schemas/bundle-security-label-request.schema.json";
const slsHookRequestValidator = ajv.compile(slsHookRequestSchema);

const validationException = (errors) => ({
  httpCode: 400,
  error: "bad_request",
  errorMessage: `Invalid request: ${prettifySchemaValidationErrors(errors)}`
});

function validateConsentDecisionHookRequest(req) {
  const body = req.body;
  if (!consentDecisionHookRequestValidator(body)) {
    throw validationException(consentDecisionHookRequestValidator.errors);
  }
}

function validateXacmlRequest(req) {
  const body = req.body;
  if (!xacmlRequestValidator(body)) {
    throw validationException(xacmlRequestValidator.errors);
  }
}

function validateSlsRequest(req) {
  const body = req.body;
  if (!slsRequestValidator(body)) {
    throw validationException(slsRequestValidator.errors);
  }
}

function validateSlsHookRequest(req) {
  const body = req.body;
  if (!slsHookRequestValidator(body)) {
    throw validationException(slsHookRequestValidator.errors);
  }
}

function prettifySchemaValidationErrors(givenErrors) {
  const errors = givenErrors || [];
  return errors
    .map((error) => `${error.instancePath} ${error.message}`)
    .join("; ");
}

export {
  validateConsentDecisionHookRequest,
  validateXacmlRequest,
  validateSlsRequest,
  validateSlsHookRequest
};
