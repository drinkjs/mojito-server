import { FastifyInstance } from "ngulf/fastify";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import jwt from "@fastify/jwt";
import config from "../config";

export default async function plugin(server: FastifyInstance) {
	// 支持上传文件
	await server.register(fastifyMultipart, {
		limits: {
			fileSize: 1000000,
			files: 1,
		},
	});

	// 支持静态文件读取
	await server.register(fastifyStatic, {
		root: config.staticPath,
		prefix: `${config.staticPrefix}/`,
	});

	await server.register(jwt, {
		// 生产环境需要配置.env.production
		secret: process.env.JWT_SECRET ?? "mojito-server",
		sign: {
			expiresIn: '30d'
		}
	});
}
