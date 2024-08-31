import { validateConsentDecisionHookRequest } from "../lib/validators";
import { asCard } from "../lib/consent-decision-card";
import { processDecision } from "../lib/consent-processor";
import { fetchConsents } from "../lib/consent-discovery";
import { maybeApplyDecision } from "../lib/decision-processor";
import logger from "../lib/logger";

async function post(req, res, next) {
  try {
    validateConsentDecisionHookRequest(req);

    const patientIds = req.body.context.patientId;
    const category = req.body.context.category || [];
    const content = req.body.context.content;

    const consentsBundle = await fetchConsents(patientIds, category);
    const decisionEntry = await processDecision(
      consentsBundle,
      req.body.context
    );

    const revisedEntry = maybeApplyDecision(decisionEntry, content);

    logger.debug(
      `Request: ${req.body.hookInstance}, Consents: ${consentsBundle.map(
        ({ fullUrl }) => fullUrl
      )}, Decision: ${JSON.stringify(revisedEntry)}`
    );

    res.send({
      cards: [asCard(revisedEntry)]
    });
  } catch (e) {
    next(e);
  }
}

export default { post };
