import Ngulf from "ngulf";
import config from "./config";
import hooks from "./hooks";
// import plugin from "./plugin";

const app = Ngulf.create({ ...config, hooks });
app
  .listen({
    port: config.port,
    host: process.env.NODE_ENV === "development" ? "0.0.0.0" : "127.0.0.1",
  })
  .then(() => {
    console.log(`mojito-server listen on ${config.port}`);
  });