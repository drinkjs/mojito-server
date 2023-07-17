import { mongoose } from "@typegoose/typegoose";
import { Injectable, MgModel, MgModelType, AppError } from "ngulf";
import ComponentTypeEntity from "../entity/ComponentTypeEntity";
import ComponentEntity from "../entity/ComponentEntity";
import { ComponentDto, ComponentTypeDto } from "../dto";
import BaseService from "./BaseService";

@Injectable()
export default class ComponentService extends BaseService {
	@MgModel(ComponentTypeEntity)
	private typeModel!: MgModelType<ComponentTypeEntity>;

	@MgModel(ComponentEntity)
	private model!: MgModelType<ComponentEntity>;

	/**
	 * 查询所有分类
	 */
	async findTypes() {
		const rel = await this.typeModel.find({ deleteAt: null }).exec();
		return this.toObject(rel);
	}

	/**
	 * 添加分类
	 * @param data
	 * @returns
	 */
	async addType(data: ComponentTypeDto) {
		const rel = await this.typeModel
			.findOne({ deleteAt: null, name: data.name, pid: data.pid })
			.exec();
		if (rel) {
			AppError.assert(`${data.name}已经存在`);
		}

		const { _id: id } = await this.typeModel.create(data);
		return id;
	}

	/**
	 * 删除分类
	 * @param data
	 * @returns
	 */
	async delType(id: string) {
		let rel = await this.typeModel.findOne({ pid: id, deleteAt: null }).exec();
		// 如果存在子类不能删除
		if (rel) {
			AppError.assert("当前分类下下存在多个子类，请先删除子类");
		}
		const comp = await this.model.findOne({ type: id }).exec();
		if (comp) {
			AppError.assert("当前分类下存在多个组件，请先迁移组件");
		}
		rel = await this.typeModel.findByIdAndUpdate(id, { deleteAt: new Date() });
		return rel;
	}

	/**
	 * 更新分类
	 * @param data
	 * @returns
	 */
	async updateType(data: ComponentTypeDto) {
		const rel = await this.typeModel.findByIdAndUpdate(
			data.id,
			{
				...data,
				status: undefined,
			},
			{ omitUndefined: true }
		);
		return rel;
	}

	/**
	 * 查询组件
	 * @param type
	 */
	async findAll(type: string, userId: string) {
		const rel = await this.model
			.find({ $or: [{ type, userId, deleteAt: null }, { origin: 1, type, deleteAt: null }] })
			.exec();
		return rel ? this.toObject(rel) : [];
	}

	async findByName(name: string, version: string) {
		const rel = await this.model.findOne({ name, version }).exec();
		return this.toObject(rel);
	}

	async findById(id: string) {
		const rel = await this.model.findOne({ _id: id }).exec();
		return this.toObject(rel);
	}

	async findByIds(ids: string[]) {
		const orIds = ids.map((id) => ({ _id: id }));
		const rel = await this.model.find({ $or: orIds }).exec();
		return this.toObject(rel) || [];
	}

	/**
	 * 新增组件库
	 * @param data
	 * @param userId
	 * @returns
	 */
	async add(data: ComponentDto, userId: string) {
		const curr = await this.model.findOne({
			name: data.name,
			version: data.version,
		});
		if (curr) {
			AppError.assert(`${data.name}@${data.version} 已经存在`);
		}
		if (data.components.length === 0) {
			AppError.assert("No Component Export");
		}

		const { _id: id } = await this.model.create({
			...data,
			type: new mongoose.Types.ObjectId(data.type),
			createAt: new Date(),
			userId,
		});
		return id;
	}

	// async update (data: ComponentDto) {
	//   const rel = await this.model.findByIdAndUpdate(
	//     data.id,
	//     {
	//       ...data,
	//       id: undefined,
	//       createTime: undefined,
	//       type: new mongoose.Types.ObjectId(data.type),
	//       updateAt: new Date,
	//     },
	//     { omitUndefined: true }
	//   );
	//   return rel;
	// }

	// async delete (id: string) {
	//   const rel = await this.model.findOneAndDelete({ _id: id });
	//   return rel;
	// }
}
