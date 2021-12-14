const { createClient } = require("redis");

const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = createClient();

(async () => {

  client.on("error", (err) => console.log("Redis Client Error", err));
//   client.on("connection", () => console.log("Redis Connected"));

  await client.connect();

})();

module.exports = client;