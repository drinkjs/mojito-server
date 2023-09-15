import Ngulf from "ngulf";
import config from "./config";
import hook from "./hooks";
import plugin from "./plugin";
import inject from "./inject";

const app = Ngulf.create({ ...config, hook, plugin, inject });
app
  .listen({
    port: config.port,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log(`mojito-server listen on ${config.port}`);
  });

console.log("ffffffffff")