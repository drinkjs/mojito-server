/* eslint-disable no-underscore-dangle */
import { Injectable, MgModel, MgModelType, AppError } from "ngulf";
import { ProjectDto } from "../dto";
import ProjectEntity from "../entity/ProjectEntity";
import { createStringDate } from "../common/utils";
import BaseService from "./BaseService";

@Injectable()
export default class ProjectService extends BaseService {
  @MgModel(ProjectEntity)
  private model!: MgModelType<ProjectEntity>;

  /**
   * 新增项目
   * @param data
   */
  async add ({userId, name}: ProjectDto) {
    const rel = await this.model.findOne({ userId, name, deleteAt: null }).exec();
    if (rel) {
      AppError.assert("项目已存在");
    }

    if (!name) {
      AppError.assert("请输入项目名称");
      return;
    }
    const project: ProjectEntity = {
      userId,
      name,
      createAt: new Date(),
    };
    const { _id: id } = await this.model.create(project);
    return id;
  }

  /**
   * 查询所有项目
   */
  async findAll (userId:string) {
    const rel = await this.model
      .find({ userId, deleteAt: null })
      .sort({ createAt: -1 })
      .exec();
    const val = this.toObject(rel);
    return val;
  }

  /**
   * 根据项目名返回项目信息
   * @param name
   */
  async findByName (name: string) {
    const rel = await this.model
      .findOne({ status: 1, name })
      .sort({ createAt: -1 })
      .exec();
    return this.toObject(rel);
  }

  /**
   * 更新项目
   * @param data
   */
  async update (data: ProjectDto, userId:string) {
    let rel = await this.model.findOne({ name: data.name, userId, deleteAt: null }).exec();
    if (rel && rel.id !== data.id) {
      AppError.assert("项目已存在");
    }

    rel = await this.model.findByIdAndUpdate(
      data.id,
      { name: data.name, updateAt: new Date  },
      { omitUndefined: true }
    );
    return rel;
  }

  /**
   * 删除项目
   * @param id
   */
  async delete (id: string) {
    const rel = await this.model.findByIdAndUpdate(id, { deleteAt: new Date });
    return rel;
  }
}
