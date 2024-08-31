import {validateSlsRequest} from "../lib/validators";
import {label} from "../lib/labeling/labeler";

async function post(req, res, next) {
  try {
    validateSlsRequest(req);
    res.send(label(req.body));
  } catch (e) {
    next(e);
  }
}

export default { post };
