const { createClient } = require("redis");

const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = createClient();

(async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
})();

module.exports = client;
