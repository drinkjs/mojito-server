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
	 * 组件库明细
	 * @param id 
	 * @returns 
	 */
	@Post("/pack/detail")
	async getPackScript(@Body("id") id: string | string[]) {
		const rel = await this.service.findById(id);
		return this.success(rel);
	}

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
}
