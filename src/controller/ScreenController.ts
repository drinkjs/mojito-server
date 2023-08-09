import { UserHeader } from "@/config";
import ComponentService from "@/service/ComponentService";
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
import { ScreenDto } from "../dto";
import ScreenService from "../service/ScreenService";

@Controller("/screen")
export default class ScreenController extends BaseController {
  // eslint-disable-next-line no-unused-vars
  constructor (private readonly service: ScreenService, private readonly componentService: ComponentService) {
    super();
  }

  /**
   * 新增页面
   * @param dto
   */
  @Post("/add")
  async add (@Body(new Validation({ groups: ["add"] })) dto: ScreenDto, @Headers(UserHeader) userId: string) {
    const relId = await this.service.add(dto, userId);
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
  async update (@Body(new Validation({ groups: ["update"] })) dto: ScreenDto, @Headers(UserHeader) userId: string) {
    if (!dto.name) {
      return this.fail("更新失败");
    }
    const rel = await this.service.update(dto, userId);
    if (rel) return this.success(null);
    return this.fail("更新失败");
  }

  /**
   * 更新页面图层信息
   * @param dto
   */
  @Post("/update/layer")
  async updateLayer (
    @Body(new Validation({ groups: ["updateLayer"] })) dto: ScreenDto,
    @Headers(UserHeader) userId: string
  ) {
    const rel = await this.service.updateScreen(dto, userId);
    if (rel) return this.success(null);
    return this.fail("图层更新失败");
  }

  /**
   * 修改封面
   * @param dto
   */
  @Post("/update/cover")
  async updateCover (
    @Body(new Validation({ groups: ["coverImg"] })) dto: ScreenDto,
    @Headers(UserHeader) userId: string
  ) {
    const rel = await this.service.updateCover(dto.id, userId, dto.coverImg!);
    if (rel) return this.success(null);
    return this.fail("更新失败");
  }

  /**
   * 删除页面
   * @param id
   */
  @Get("/delete")
  async delete (@Query("id") id: string, @Headers(UserHeader) userId: string) {
    const rel = await this.service.delete(id, userId);
    if (rel) {
      return this.success(null);
    }
    return this.fail("删除失败");
  }

  /**
   * 页面明细
   * @param id 大屏id
   */
  @Get("/editor/detail")
  async detail (@Query("id") id: string, @Headers(UserHeader) userId: string) {
    const screenInfo = await this.service.findDetailById(id, userId);
    let packInfo:any
    if(screenInfo && screenInfo.layers){
      const packIds = screenInfo.layers.map(v => v?.component?.packId);
      packInfo = packIds.length ? await this.componentService.findByIds(packIds) : undefined;
    }
    return screenInfo ? this.success({screenInfo, packInfo}) : this.fail("页面不存在");
  }

  @Get("/viewer/detail")
  async viewDetail (@Query("id") id: string) {
    const screenInfo = await this.service.findDetailById(id);
    let packInfo:any
    if(screenInfo && screenInfo.layers){
      const packIds = screenInfo.layers.map(v => v?.component?.packId);
      packInfo = packIds.length ? await this.componentService.findByIds(packIds) : undefined;
    }
    return screenInfo ? this.success({screenInfo, packInfo}) : this.fail("页面不存在");
  }
}
