const _ = require("lodash");
const request = require("supertest");
const { app } = require("../../src/app");

const BUNDLE = require("../fixtures/empty-bundle.json");
const OBSERVATION = require("../fixtures/observations/observations-ketamine.json");
const NON_SENSITIVE_OBSERVATION = require("../fixtures/observations/observation-bacteria.json");

it("should return 200 and a labeled bundle", async () => {
  const bundleOfObservations = _.cloneDeep(BUNDLE);
  bundleOfObservations.entry = [
    { fullUrl: "1", resource: OBSERVATION },
    { fullUrl: "2", resource: NON_SENSITIVE_OBSERVATION }
  ];
  bundleOfObservations.total = 2;

  const res = await request(app)
    .post("/cds-services/bundle-security-label")
    .set("Accept", "application/json")
    .send({
      hookInstance: "...",
      hook: "bundle-security-label",
      context: {
        bundle: bundleOfObservations
      }
    });

  expect(res.status).toEqual(200);

  const systemActions = res.body.systemActions;
  expect(systemActions.length).toBe(1);
  expect(systemActions[0].type).toBe("update");
  expect(systemActions[0].resource.meta?.security).toMatchObject(
    expect.arrayContaining([
      expect.objectContaining({
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "SUD"
      }),
      expect.objectContaining({
        system: "http://terminology.hl7.org/CodeSystem/v3-Confidentiality",
        code: "R"
      })
    ])
  );
});
