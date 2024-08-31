import { validateSlsHookRequest } from "../lib/validators";
import { labelBundleDiff } from "../lib/labeling/labeler";
import { resourcesToHookResponse } from "../lib/labeling/sls-decision-hooks-response";

async function post(req, res, next) {
  try {
    validateSlsHookRequest(req);
    const bundle = req.body.context.bundle;
    res.send(resourcesToHookResponse(labelBundleDiff(bundle)));
  } catch (e) {
    next(e);
  }
}

export default { post };
