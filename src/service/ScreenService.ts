import { mongoose } from "@typegoose/typegoose";
import { Injectable, MgModel, MgModelType, AppError } from "ngulf";
import { DatasourceDto, ScreenDto } from "../dto";
import { createStringDate } from "../common/utils";
import ScreenEntity from "../entity/ScreenEntity";
import BaseService from "./BaseService";

@Injectable()
export default class ScreenService extends BaseService {
  constructor(
  ) {
    super();
  }

  @MgModel(ScreenEntity)
  private model!: MgModelType<ScreenEntity>;

  /**
   * 新增页面
   * @param data
   */
  async add(data: ScreenDto, userId: string) {
    const rel = await this.model
      .findOne({ name: data.name, deleteAt: null, projectId: data.projectId })
      .exec();
    if (rel) {
      AppError.assert("页面已存在");
    }

    const view: ScreenEntity = {
      userId,
      projectId: data.projectId,
      name: data.name,
      style: data.style,
      createAt: new Date(),
      updateAt: new Date(),
    };
    const { _id: id } = await this.model.create({
      ...view,
      projectId: new mongoose.Types.ObjectId(data.projectId),
    });
    return id;
  }

  /**
   * 查询项目下的所有页面
   */
  async findByProject(projectId: string) {
    const rel = await this.model
      .find({ deleteAt: null, projectId })
      .sort({ _id: -1 })
      .exec();
    return rel ? this.toObjects(rel) : [];
  }

  /**
   * 页面详细信息
   * @param id
   * @returns
   */
  async findDetailById(id: string, userId?: string) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;

    const filter:any = { _id: id, deleteAt: null }
    if(userId){
      filter.userId = userId;
    }

    const rel = await this.model
      .findOne(filter, { coverImg: 0 })
      .exec();
    if (!rel) return null;
    return this.toObject(rel);
  }

  /**
   * 更新页面信息
   * @param data
   */
  async update(data: ScreenDto, userId: string) {
    let rel = await this.model
      .findOne({ name: data.name, projectId: data.projectId, deleteAt: null })
      .exec();
    if (rel && rel.id !== data.id) {
      AppError.assert("页面已存在");
    }
   return await this.model.updateOne(
      { _id: data.id, userId },
      {
        name: data.name,
        style: data.style,
        updateAt: new Date,
      },
      { omitUndefined: true }
    );
  }

  /**
   * 更新页面图层信息
   * @param data
   * @returns
   */
  async updateScreen(data: ScreenDto, userId: string) {
    const updateData: any = data;
    delete updateData.createAt;
    delete updateData.projectId;
    const rel = await this.model.updateOne(
      { _id: updateData.id, userId },
      {
        ...updateData,
        updateAt: new Date,
        _id: undefined,
        userId: undefined,
        projectId: undefined
      },
      { omitUndefined: true }
    );
    return rel;
  }

  /**
   * 更新页面封面
   * @param id
   * @param imgPath
   */
  async updateCover(id: string, userId: string, imgPath: string) {
    const rel = await this.model.updateOne({ _id: id, userId }, {
      coverImg: imgPath,
    });
    return rel;
  }

  /**
   * 删除页面
   * @param id
   */
  async delete(id: string, userId: string) {
    const rel = await this.model.updateOne({ _id: id, userId }, { deleteAt: new Date });
    return rel;
  }
}
