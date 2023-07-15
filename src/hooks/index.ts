import { AppError } from "ngulf";
import { FastifyInstance } from "fastify";
import config from "../config";

export default async function hook (server: FastifyInstance) {
  // 异常处理
  server.setErrorHandler((error, request, reply) => {
    console.error(error)
    if (error instanceof AppError) {
      reply.send({
        code: 1,
        msg: error.message,
      });
    } else {
      reply.send({
        code: 500,
        msg:
          process.env.NODE_ENV === "development"
            ? error.message
            : "系统异常，请联系管理员",
      });
    }
  });

  server.addHook("onRequest", async (request, reply)=>{
    const url = request.url;
    if(url.indexOf(config.staticPrefix) === 0){
      // 访问静态资源
      return;
    }
    const token = request.headers["x-token"] as string;
    if(!token){
      reply.send({
        code: -1,
        msg: "No Token",
      });
    }
  })
}
