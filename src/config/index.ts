import dotenv from "dotenv";
import { NgulfHttpOptions, NgulfHtt2Options, NgulfHttsOptions } from "ngulf";
import path from "path";

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const staticPath = process.env.STATIC_PATH || `${process.cwd()}/public`;
console.info(staticPath.bgBlue);

export type IConfig = NgulfHttpOptions | NgulfHtt2Options | NgulfHttsOptions;

// export interface IConfig extends NgulfOptions {
//   readonly sessionSecret: string;
//   readonly port: number;
//   readonly staticPrefix: string;
//   readonly staticPath: string;
//   readonly libPath: string;
// }

const defaultConfig: IConfig & { port: number } = {
  port: 3838,
  websocket: true, // 是否启用websocket
  logger: false,
  controllers: path.join(__dirname, "../controller"),
  mongo: {
    // see https://mongoosejs.com/
    uris: "mongodb://127.0.0.1:27017/",
    options: {
      dbName: "mojito",
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
      // useFindAndModify: false,
    },
  },
};

export default defaultConfig;
