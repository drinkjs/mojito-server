import dotenv from "dotenv";
import { NgulfHttpOptions, NgulfHtt2Options, NgulfHttsOptions } from "ngulf";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const staticPath = process.env.STATIC_PATH || `${process.cwd()}/public`;
console.info(staticPath.bgBlue);

export const UserHeader = "mojito-user";

export type IConfig = {
  staticPath:string,
  staticPrefix:string,
  port: number
} & (NgulfHttpOptions | NgulfHtt2Options | NgulfHttsOptions);

const defaultConfig: IConfig = {
  port: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3840,
  websocket: true, // 是否启用websocket
  logger: false,
  controllers: path.join(__dirname, "../controller"),
  staticPath,
  staticPrefix: "/public",
};

export default defaultConfig;
