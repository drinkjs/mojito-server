import { UserHeader } from "@/config";
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
import { ComponentDto, ComponentTypeDto } from "@/dto";
import ComponentService from "@/service/ComponentService";
@Controller("/component")
export default class ComponentController extends BaseController {
	constructor(private readonly service: ComponentService) {
		super();
	}

	/**
	 * 组件类型树
	 */
	@Get("/types")
	async getTypes(@Headers(UserHeader) userId: string) {
		const rel = await this.service.findTypes(userId);
		return this.success(rel);
	}

	/**
	 * 用户的组件类型树
	 */
	@Get("/user/types")
	async getUserTypes(@Headers(UserHeader) userId: string) {
		const rel = await this.service.findUserTypes(userId);
		return this.success(rel);
	}

	/**
	 * 添加组件类型
	 */
	@Post("/type/add")
	async addType(
		@Body(new Validation({ groups: ["add"] })) dto: ComponentTypeDto,
		@Headers(UserHeader) userId: string
	) {
		const rel = await this.service.addType(dto, userId);
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
		@Headers(UserHeader) userId: string
	) {
		const rel = await this.service.updateType(dto, userId);
		if (rel) {
			return this.success(rel);
		}
		return this.fail("更新失败");
	}

	/**
	 * 添加组件类型
	 */
	@Get("/type/delete")
	async delType(@Query("id") id: string, @Headers(UserHeader) userId: string) {
		await this.service.delType(id, userId);
		return this.success(null);
	}

	/**
	 * 系统及用户组件库
	 */
	@Get("/list")
	async list(@Query("type") type: string, @Headers(UserHeader) userId: string) {
		const rel = await this.service.findAllLibs(type, userId);
		return this.success(rel);
	}

	/**
	 * 用户组件库
	 * @param type 
	 * @param userId 
	 * @returns 
	 */
	@Get("/libs")
	async libs(@Query("type") type: string, @Headers(UserHeader) userId: string) {
		const rel = await this.service.findUserLibs(type, userId);
		return this.success(rel);
	}

	/**
	 * 删除组件库
	 * @param id 
	 * @param userId 
	 * @returns 
	 */
	@Get("/lib/delete")
	async libDelete(@Query("id") id: string, @Headers(UserHeader) userId: string) {
		const rel = await this.service.deleteLib(id, userId);
		return this.success(rel);
	}

	/**
	 * 组件库明细
	 * @param id 
	 * @returns 
	 */
	@Post("/pack/detail")
	async getPackScript(@Body("id") id: string | string[], @Headers(UserHeader) userId: string) {
		const rel = await this.service.findById(id, userId);
		return this.success(rel);
	}

	/**
	 * 增加组件库
	 * @param dto
	 */
	@Post("/add")
	async addLib(
		@Body(new Validation({ groups: ["add"] })) dto: ComponentDto,
		@Headers(UserHeader) userId: string
	) {
		const rel = await this.service.addLib(dto, userId);
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
		@Headers(UserHeader) userId: string
	) {
		const rel = await this.service.updateLib(dto, userId);
		if (rel) {
			return this.success(null);
		}
		return this.fail("更新失败");
	}

	/**
	* 获取iconfont
	* @param userId
	*/
	@Get("/iconfont")
	async getIconFont(
		@Headers(UserHeader) userId: string
	) {
		const rel = await this.service.getIconFont(userId);
		return this.success(rel);
	}

	/**
	* add iconfont
	* @param userId
	*/
	@Post("/iconfont/add")
	async addIconFont(
		@Body(new Validation({ groups: ["add"] })) dto: IconFontDto,
		@Headers(UserHeader) userId: string
	) {
		const rel = await this.service.addIconFont(dto, userId);
		return this.success(rel);
	}

	/**
	* update iconfont
	* @param userId
	*/
	@Post("/iconfont/update")
	async updateIconFont(
		@Body(new Validation({ groups: ["update"] })) dto: IconFontDto,
		@Headers(UserHeader) userId: string
	) {
		const rel = await this.service.updateIconFont(dto, userId);
		console.log(rel);
		return this.success(true);
	}
}
