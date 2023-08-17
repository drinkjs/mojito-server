import { AppError } from "ngulf";
import { FastifyInstance } from "fastify";
import config, { UserHeader } from "../config";

export default async function hook(server: FastifyInstance) {
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

  server.addHook("onRequest", async (request, reply) => {
    const { routerPath } = request;
    if (routerPath === config.staticPrefix || routerPath === `${config.staticPrefix}/*` || routerPath === "/user/auth") {
      // 访问静态资源
      return;
    }
    const token = request.headers["x-token"] as string;
    if (!token) {
      reply.send({
        code: 403,
        msg: "No Token",
      });
    }
    try {
      const decode = server.jwt.verify<{ name: string, id: string }>(token);
      if (decode.name && decode.id) {
        request.headers[UserHeader] = decode.id;
      } else {
        reply.send({
          code: 403,
          msg: "No User Info",
        });
      }
    }catch(e:any){
      reply.send({
        code: 403,
        msg: 'Token Error'
      });
    }
  })
}
