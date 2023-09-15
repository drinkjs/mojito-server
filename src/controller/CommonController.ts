import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Controller, Post, BaseController } from "ngulf";
import type { RouterContext } from "ngulf/types";
import { createStringDate } from "../common/utils";
import config from "../config";
import path from "path";

@Controller()
export default class CommonController extends BaseController {
	private readonly staticPath = config.staticPath;

	/**
	 * 上传图片
	 * @param ctx
	 */
	@Post("/upload/image")
	async uploadImage(ctx: RouterContext) {
		const { req } = ctx;
		const files = await req.saveRequestFiles();
		const file = files[0];
		if (!file.mimetype || file.mimetype.indexOf("image/") === -1) {
			return this.fail("只能上传图片格式文件");
		}

		const ext = path.extname(file.filepath);
		const dataPath = `upload/${createStringDate("YYYYMMDD")}`;
		const fileName = uuidv4();

		const urlPath = `${dataPath}/${fileName}${ext}`;
		const savePath = `${this.staticPath}/${urlPath}`;

		// 创建目录并复制文件
		fs.mkdirSync(`${this.staticPath}/${dataPath}`, { recursive: true });
		fs.createReadStream(file.filepath).pipe(fs.createWriteStream(savePath));

		return this.success({
			path: `${config.staticPrefix}/${urlPath}`,
		});
	}
}
