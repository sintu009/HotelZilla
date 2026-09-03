// validate(schema) — use as route middleware
// schema must be a zod object with optional .body / .query / .params keys
const validate = (schema) => (req, res, next) => {
  try {
    if (schema.body)   req.body   = schema.body.parse(req.body);
    if (schema.query)  req.query  = schema.query.parse(req.query);
    if (schema.params) req.params = schema.params.parse(req.params);
    next();
  } catch (err) {
    next(err); // ZodError → caught by errorHandler
  }
};

module.exports = validate;
