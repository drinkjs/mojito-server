import { IconFontDto } from "@/dto/IconFontDto";
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
	async getTypes(@Headers("x-token") token: string) {
		const rel = await this.service.findTypes(token);
		return this.success(rel);
	}

	/**
	 * 用户的组件类型树
	 */
	@Get("/user/types")
	async getUserTypes(@Headers("x-token") token: string) {
		const rel = await this.service.findUserTypes(token);
		return this.success(rel);
	}

	/**
	 * 添加组件类型
	 */
	@Post("/type/add")
	async addType(
		@Body(new Validation({ groups: ["add"] })) dto: ComponentTypeDto,
		@Headers("x-token") token: string
	) {
		const rel = await this.service.addType(dto, token);
		if (rel) {
			return this.success(rel);
		}
		return this.fail("添加失败");
	}

	/**
	 * 更新组件类型
	 */
	@Post("/type/update")
	async updateType(
		@Body(new Validation({ groups: ["update"] })) dto: ComponentTypeDto,
		@Headers("x-token") token: string
	) {
		const rel = await this.service.updateType(dto, token);
		if (rel) {
			return this.success(rel);
		}
		return this.fail("更新失败");
	}

	/**
	 * 添加组件类型
	 */
	@Get("/type/delete")
	async delType(@Query("id") id: string, @Headers("x-token") token: string) {
		await this.service.delType(id, token);
		return this.success(null);
	}

	/**
	 * 系统及用户组件库
	 */
	@Get("/list")
	async list(@Query("type") type: string, @Headers("x-token") token: string) {
		const rel = await this.service.findAllLibs(type, token);
		return this.success(rel);
	}

	/**
	 * 用户组件库
	 * @param type 
	 * @param token 
	 * @returns 
	 */
	@Get("/libs")
	async libs(@Query("type") type: string, @Headers("x-token") token: string) {
		const rel = await this.service.findUserLibs(type, token);
		return this.success(rel);
	}

	/**
	 * 删除组件库
	 * @param id 
	 * @param token 
	 * @returns 
	 */
	@Get("/lib/delete")
	async libDelete(@Query("id") id: string, @Headers("x-token") token: string) {
		const rel = await this.service.deleteLib(id, token);
		return this.success(rel);
	}

	/**
	 * 组件库明细
	 * @param id 
	 * @returns 
	 */
	@Post("/pack/detail")
	async getPackScript(@Body("id") id: string | string[], @Headers("x-token") token: string) {
		const rel = await this.service.findById(id, token);
		return this.success(rel);
	}

	/**
	 * 增加组件库
	 * @param dto
	 */
	@Post("/add")
	async addLib(
		@Body(new Validation({ groups: ["add"] })) dto: ComponentDto,
		@Headers("x-token") token: string
	) {
		const rel = await this.service.addLib(dto, token);
		if (rel) {
			return this.success(null);
		}
		return this.fail("添加失败");
	}

	/**
	 * 更新组件库
	 * @param dto
	 */
	@Post("/update")
	async updateLib(
		@Body(new Validation({ groups: ["update"] })) dto: ComponentDto,
		@Headers("x-token") token: string
	) {
		const rel = await this.service.updateLib(dto, token);
		if (rel) {
			return this.success(null);
		}
		return this.fail("更新失败");
	}

	/**
	* 获取iconfont
	* @param token
	*/
	@Get("/iconfont")
	async getIconFont(
		@Headers("x-token") token: string
	) {
		const rel = await this.service.getIconFont(token);
		return this.success(rel);
	}

	/**
	* add iconfont
	* @param token
	*/
	@Post("/iconfont/add")
	async addIconFont(
		@Body(new Validation({ groups: ["add"] })) dto: IconFontDto,
		@Headers("x-token") token: string
	) {
		const rel = await this.service.addIconFont(dto, token);
		return this.success(rel);
	}

	/**
	* update iconfont
	* @param token
	*/
	@Post("/iconfont/update")
	async updateIconFont(
		@Body(new Validation({ groups: ["update"] })) dto: IconFontDto,
		@Headers("x-token") token: string
	) {
		const rel = await this.service.updateIconFont(dto, token);
		console.log(rel);
		return this.success(true);
	}
}
