import { CONSENT_PERMIT } from "./consent-decisions";
import { maybeRedactBundle } from "./redacter";
import { label } from "./labeling/labeler";

const maybeApplyDecision = (decisionEntry, content) => {
  return content && decisionEntry.decision === CONSENT_PERMIT
    ? {
        ...decisionEntry,
        content: maybeRedactBundle(decisionEntry.obligations, label(content))
      }
    : decisionEntry;
};
export { maybeApplyDecision };
