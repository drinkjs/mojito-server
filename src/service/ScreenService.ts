import { mongoose } from "@typegoose/typegoose";
import { Injectable, MgModel, MgModelType, AppError } from "ngulf";
import { DatasourceDto, ScreenDto } from "../dto";
import { createStringDate } from "../common/utils";
import ScreenEntity from "../entity/ScreenEntity";
import BaseService from "./BaseService";

@Injectable()
export default class ScreenService extends BaseService {
  constructor (
  ) {
    super();
  }

  @MgModel(ScreenEntity)
  private model!: MgModelType<ScreenEntity>;

  /**
   * 新增页面
   * @param data
   */
  async add (data: ScreenDto, userId:string) {
    const rel = await this.model
      .findOne({ name: data.name, status: 1, projectId: data.projectId })
      .exec();
    if (rel) {
      AppError.assert("页面已存在");
    }

    const project: ScreenEntity = {
      projectId: data.projectId,
      name: data.name,
      style: data.style,
      createAt: new Date(),
      updateAt: new Date(),
      dataSources: [],
      userId
    };
    const { _id: id } = await this.model.create({
      ...project,
      projectId: new mongoose.Types.ObjectId(data.projectId),
    });
    return id;
  }

  /**
   * 查询项目下的所有页面
   */
  async findByProject (projectId: string) {
    const rel = await this.model
      .find({ deleteAt: null, projectId })
      .sort({ updateTime: -1 })
      .exec();
    return rel ? this.toObject(rel) : [];
  }

  /**
   * 页面详细信息
   * @param id
   * @returns
   */
  async findDetailById (id: string) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;

    const rel = await this.model
      .findOne({ _id: id, deleteAt: null }, { coverImg: 0 })
      .populate({ path: "projectId", select: "name" })
      .exec();
    if (!rel) return null;
    return this.toObject(rel);
  }

  /**
   * 更新页面信息
   * @param data
   */
  async update (data: ScreenDto) {
    let rel = await this.model
      .findOne({ name: data.name, projectId: data.projectId, status: 1 })
      .exec();
    if (rel && rel.id !== data.id) {
      AppError.assert("页面已存在");
    }
    rel = await this.model.findByIdAndUpdate(
      data.id,
      {
        name: data.name,
        style: data.style,
        updateTime: createStringDate(),
      },
      { omitUndefined: true }
    );
    return rel;
  }

  /**
   * 更新页面图层信息
   * @param data
   * @returns
   */
  async updateScreen (data: ScreenDto) {
    const rel = await this.model.findByIdAndUpdate(
      data.id,
      {
        layers: data.layers
          ? data.layers.map((v) => ({ ...v, component: v.component?.id }))
          : [],
        style: data.style,
        updateTime: createStringDate(),
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
  async updateCover (id: string, imgPath: string) {
    const rel = await this.model.findByIdAndUpdate(id, {
      coverImg: imgPath,
    });
    return rel;
  }

  /**
   * 删除页面
   * @param id
   */
  async delete (id: string) {
    const rel = await this.model.findByIdAndUpdate(id, { deleteAt: new Date });
    return rel;
  }

  /**
   * 新增数据源
   * @param id
   * @param imgPath
   * @returns
   */
  async addDatasource (id: string, dto: DatasourceDto) {
    const rel = await this.model.findById(id);

    if (rel && rel.dataSources) {
      const datasource = rel.dataSources.find(
        (v) =>
          `${v.type}://${v.host}:${v.port}@${v.username}` ===
          `${dto.type}://${dto.host}:${dto.port}@${dto.username}`
      );
      if (datasource) {
        AppError.assert("数据源已存在");
      }
    }

    const data: DatasourceInfo = {
      id: new mongoose.Types.ObjectId(),
      type: dto.type,
      host: dto.host,
      port: dto.port,
      username: dto.username,
      password: dto.password || "",
      database: dto.database,
    };
    return await this.model.updateOne(
      { _id: id },
      { updateTime: createStringDate(), $push: { dataSources: data } }
    );
  }

  /**
   * 删除数据源
   * @param id
   * @returns
   */
  async delDatasource (screenId: string, datasourceId: string) {
    return await this.model.updateOne(
      { _id: screenId },
      {
        updateTime: createStringDate(),
        $pull: {
          dataSources: { id: new mongoose.Types.ObjectId(datasourceId) },
        },
      }
    );
  }
}
