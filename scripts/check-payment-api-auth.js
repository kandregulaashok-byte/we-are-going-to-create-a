const handler = require("../api/create-payment-hold");

const req = { method: "POST", headers: {}, body: {}, socket: { remoteAddress: "test" } };
const res = {
  statusCode: 0,
  body: null,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; }
};

handler(req, res).then(() => {
  console.assert(res.statusCode === 401, "create-payment-hold must require login");
  console.log("payment api auth check passed");
});
