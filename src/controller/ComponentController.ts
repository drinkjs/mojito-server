import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	Validation,
	BaseController,
  Headers
} from "ngulf";
import { ComponentDto, ComponentTypeDto } from "../dto";
import ComponentService from "../service/ComponentService";
@Controller("/component")
export default class ComponentController extends BaseController {
	constructor(private readonly service: ComponentService) {
		super();
	}

	/**
	 * 组件类型树
	 */
	@Get("/types")
	async getTypes() {
		const rel = await this.service.findTypes();
		return this.success(rel);
	}

	/**
	 * 添加组件类型
	 */
	@Post("/type/add")
	async addType(
		@Body(new Validation({ groups: ["add"] })) dto: ComponentTypeDto
	) {
		const rel = await this.service.addType(dto);
		if (rel) {
			return this.success(rel);
		}
		return this.fail("添加失败");
	}

	/**
	 * 添加组件类型
	 */
	@Post("/type/update")
	async updateType(
		@Body(new Validation({ groups: ["update"] })) dto: ComponentTypeDto
	) {
		const rel = await this.service.updateType(dto);
		if (rel) {
			return this.success(rel);
		}
		return this.fail("更新失败");
	}

	/**
	 * 添加组件类型
	 */
	@Get("/type/delete")
	async delType(@Query("id") id: string) {
		const rel = await this.service.delType(id);
		if (rel) {
			return this.success(null);
		}
		return this.fail("删除失败");
	}

	/**
	 * 组件列表
	 */
	@Get("/list")
	async list(@Query("type") type:string, @Headers("x-token") token:string) {
		const rel = await this.service.findAll(type, token);
		return this.success(rel);
	}

	/**
	 * 获取mojito-pack.json信息
	 */
	@Get("/pack/info")
	async getPack(@Query("url") packUrl: string) {
		const res = await fetch(packUrl).catch((err) => {
			console.log(err);
			return err.message;
		});
		if (res.ok) {
			const data = await res.json();
			return this.success(data);
		}
		return this.fail(`GET ${packUrl} ${res}`);
	}

	/**
	 * 组件库明细
	 * @param id 
	 * @returns 
	 */
	@Get("/pack/detail")
	async getPackScript(@Query("id") id: string) {
		const rel = await this.service.findById(id);
		return this.success(rel);
	}

	// /**
	//  * 上传组件
	//  * @param file
	//  */
	// @Post("/upload")
	// async upload (ctx: RouterContext) {
	//   const { req } = ctx;
	//   const data = await req.file();
	//   const fields = data.fields as any;
	//   const rel = await this.unzip(
	//     data.file,
	//     this.libSavePath,
	//     fields.libId ? fields.libId.value : undefined
	//   ).catch((error: Error) => {
	//     AppError.assert(error ? error.message : "上传失败");
	//   });
	//   return this.success(rel);
	// }

	/**
	 * 增加三方组件
	 * @param dto
	 */
	@Post("/add")
	async addComponent (
	  @Body(new Validation({ groups: ["add"] })) dto: ComponentDto,
    @Headers("x-token") token:string
	) {
	  const rel = await this.service.add(dto, token);
    if(rel){
      return this.success(null);
    }
	  return this.fail("添加失败");
	}

	// /**
	//  * 修改三方组件
	//  * @param dto
	//  */
	// @Post("/update")
	// async updateComponent (
	//   @Body(new Validation({ groups: ["update"] })) dto: ComponentDto
	// ) {
	//   const rel = await this.service.update({ ...dto, origin: 2 });
	//   // 复制文件
	//   const dest = this.libSavePath;
	//   const savePath = `${dest}/${dto.name}${dto.version}`;
	//   const directory = `${dest}/${dto.sid}`;
	//   let cpRel = true;
	//   if (dto.sid) {
	//     cpRel = await this.ncpAndRm(directory, savePath);
	//   }

	//   if (rel && cpRel) {
	//     return this.success(rel);
	//   }

	//   return this.fail("更新失败");
	// }

	// /**
	//  * 组件列表
	//  */
	// @Get("/delete")
	// async del (@Query("id") id: string) {
	//   const rel = await this.service.delete(id);
	//   if (rel) {
	//     // 删除组件目录
	//     const savePath = `${this.libSavePath}/${rel.name}${rel.version}`;
	//     rmdir(savePath);
	//   } else {
	//     return this.fail("删除失败");
	//   }
	//   return this.success(null);
	// }

	// /**
	//  * 组件详情
	//  */
	// @Get("/detail")
	// async detail (@Query("id") id: string) {
	//   const rel = await this.service.findById(id);
	//   return this.success(rel);
	// }
}
