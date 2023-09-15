import { AppError } from "ngulf";
import { FastifyInstance } from "ngulf/fastify";
import config, { UserHeader } from "@/config";

const WhiteList = [
  config.staticPrefix,
  `${config.staticPrefix}/*`,
  "/user/auth",
  "/screen/viewer/detail",
]

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
    if (WhiteList.includes(routerPath)) {
      // 访问静态资源
      return;
    }
    const token = request.headers["x-token"] as string;
    if (!token) {
      reply.send({
        code: 403,
        msg: "",
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
