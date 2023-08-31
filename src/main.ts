import Ngulf from "ngulf";
import config from "./config";
import hooks from "./hooks";
import plugin from "./plugin";

const app = Ngulf.create({ ...config, hooks, plugin });
app
  .listen({
    port: config.port,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log(`mojito-server listen on ${config.port}`);
  });