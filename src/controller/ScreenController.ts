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
import { DatasourceDto, ScreenDto } from "../dto";
import ScreenService from "../service/ScreenService";

@Controller("/screen")
export default class ScreenController extends BaseController {
  // eslint-disable-next-line no-unused-vars
  constructor (private readonly service: ScreenService) {
    super();
  }

  /**
   * 新增页面
   * @param dto
   */
  @Post("/add")
  async add (@Body(new Validation({ groups: ["add"] })) dto: ScreenDto, @Headers("x-token") token:string) {
    const relId = await this.service.add(dto, token);
    if (relId) return this.success(relId);
    return this.fail("添加失败");
  }

  /**
   * 项目页面列表
   * @param projectId
   */
  @Get("/list")
  async list (@Query("projectId") projectId: string) {
    const rel = await this.service.findByProject(projectId);
    return this.success(rel);
  }

  /**
   * 更新页面信息
   * @param dto
   */
  @Post("/update")
  async update (@Body(new Validation({ groups: ["update"] })) dto: ScreenDto) {
    dto.name = dto.name.replace("/", "");
    if (!dto.name) {
      return this.fail("更新失败");
    }
    const rel = await this.service.update(dto);
    if (rel) return this.success(null);
    return this.fail("更新失败");
  }

  /**
   * 更新页面图层信息
   * @param dto
   */
  @Post("/update/layer")
  async updateLayer (
    @Body(new Validation({ groups: ["updateLayer"] })) dto: ScreenDto
  ) {
    const rel = await this.service.updateScreen(dto);
    if (rel) return this.success(null);
    return this.fail("图层更新失败");
  }

  /**
   * 修改封面
   * @param dto
   */
  @Post("/update/cover")
  async updateCover (
    @Body(new Validation({ groups: ["coverImg"] })) dto: ScreenDto
  ) {
    const rel = await this.service.updateCover(dto.id, dto.coverImg!);
    if (rel) return this.success(null);
    return this.fail("更新失败");
  }

  /**
   * 删除页面
   * @param id
   */
  @Get("/delete")
  async delete (@Query("id") id: string) {
    const rel = await this.service.delete(id);
    if (rel) {
      return this.success(null);
    }
    return this.fail("删除失败");
  }

  /**
   * 页面明细
   * @param id 大屏id
   */
  @Get("/detail")
  async detail (@Query("id") id: string) {
    const rel = await this.service.findDetailById(id);
    return rel ? this.success(rel) : this.fail("页面不存在");
  }

  /**
   * 添加数据源连接
   * @param dto
   * @returns
   */
  @Post("/datasource/add")
  async addDatasource (
    @Body(new Validation({ groups: ["add"] })) dto: DatasourceDto
  ) {
    const rel = await this.service.addDatasource(dto.screenId, dto);
    return rel ? this.success(rel) : this.fail("添加失败");
  }

  /**
   * 删除数据源连接
   * @param dto
   * @returns
   */
  @Post("/datasource/delete")
  async delDatasource (
    @Body(new Validation({ groups: ["delete"] })) dto: DatasourceDto
  ) {
    const rel = dto.id
      ? await this.service.delDatasource(dto.screenId, dto.id)
      : false;
    return rel ? this.success(rel) : this.fail("删除失败");
  }
}
