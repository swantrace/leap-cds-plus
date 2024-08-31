import { codeEquals } from "./codes";
import CONSENT_VALUESETS from "./consent-valuesets";

const redactObligations = (obligations) =>
  obligations.filter(({ id }) => codeEquals(id, CONSENT_VALUESETS.REDACT_CODE));

function redactedContentClasses(obligations) {
  return redactObligations(obligations)
    .map(({ parameters }) => parameters.codes)
    .flat()
    .filter(({ system }) =>
      CONSENT_VALUESETS.CONTENT_CLASS_SYSTEMS.includes(system)
    );
}

export default {
  redactedContentClasses
};
