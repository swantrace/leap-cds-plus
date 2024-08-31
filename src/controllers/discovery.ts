import serviceDefinitions from "../schemas/service-definitions.json";

function discovery(req, res) {
  res.json({
    services: serviceDefinitions
  });
}

export { discovery };
