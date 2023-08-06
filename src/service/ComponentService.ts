import { mongoose } from "@typegoose/typegoose";
import { Injectable, MgModel, MgModelType, AppError } from "ngulf";
import ComponentTypeEntity from "../entity/ComponentTypeEntity";
import ComponentEntity from "../entity/ComponentEntity";
import { ComponentDto, ComponentTypeDto } from "../dto";
import BaseService from "./BaseService";
import IconFontEntity from "@/entity/IconFontEntity";

@Injectable()
export default class ComponentService extends BaseService {
	@MgModel(ComponentTypeEntity)
	private typeModel!: MgModelType<ComponentTypeEntity>;

	@MgModel(ComponentEntity)
	private model!: MgModelType<ComponentEntity>;

	@MgModel(IconFontEntity)
	private iconModel!: MgModelType<IconFontEntity>;

	/**
	 * 查询所有分类
	 */
	async findTypes(userId: string) {
		const rel = await this.typeModel.find({ $or: [{ userId }, { origin: 999 }] }).sort({ _id: -1 }).exec();
		return this.toObjects(rel);
	}

	/**
	 * 查询所有分类
	 */
	async findUserTypes(userId: string) {
		const rel = await this.typeModel.find({ userId }).exec();
		return this.toObjects(rel);
	}

	/**
	 * 添加分类
	 * @param data
	 * @returns
	 */
	async addType(data: ComponentTypeDto, userId: string) {
		const rel = await this.typeModel
			.findOne({ $or: [{ name: data.name, pid: data.pid, userId }, { origin: 999, name: data.name, pid: data.pid }] })
			.exec();
		if (rel) {
			AppError.assert(`${data.name}已经存在`);
		}

		const { _id: id } = await this.typeModel.create({ ...data, userId, origin: 1 });
		return id;
	}

	/**
	 * 删除分类
	 * @param id
	 * @param userId
	 * @returns
	 */
	async delType(id: string, userId: string) {
		const rel = await this.typeModel.findOne({ pid: id, userId }).exec();
		// 如果存在子类不能删除
		if (rel) {
			AppError.assert("当前分类下下存在多个子类，请先删除子类");
		}
		const comp = await this.model.findOne({ type: id }).exec();
		if (comp) {
			AppError.assert("当前分类下存在多个组件，请先迁移组件");
		}
		return await this.typeModel.deleteOne({ _id: id, userId });
	}

	/**
	 * 更新分类
	 * @param data
	 * @returns
	 */
	async updateType(data: ComponentTypeDto, userId: string) {
		const rel = await this.typeModel
			.findOne({ $or: [{ name: data.name, pid: data.pid, userId }, { origin: 999, name: data.name, pid: data.pid }] })
			.exec();

		if (rel && rel.id !== data.id) {
			AppError.assert(`${data.name}已经存在`);
		}

		return await this.typeModel.updateOne(
			{ _id: data.id, userId },
			{
				name: data.name,
				icon: data.icon,
				pid: data.pid,
				updateAt: new Date()
			},
			{ omitUndefined: true }
		);
	}

	/**
	 * 查询类型下的所有组件库，包括系统组件库
	 * @param type
	 */
	async findAllLibs(type: string, userId: string) {
		const rel = await this.model
			.find({ $or: [{ type, userId, deleteAt: null }, { origin: 999, type, deleteAt: null }] })
			.exec();
		return rel ? this.toObjects(rel) : [];
	}

	/**
	 * 查询类型下的用户的所有组件库
	 * @param type 
	 * @param userId 
	 * @returns 
	 */
	async findUserLibs(type: string, userId: string) {
		const rel = await this.model
			.find({ type, userId, deleteAt: null })
			.exec();
		return rel ? this.toObjects(rel) : [];
	}

	async findById(id: string | string[], userId: string) {
		return typeof id === "string" ?
			this.toObject(await this.model.findOne({ _id: id, userId, deleteAt: null }).exec()) :
			await this.findByIds(id);
	}

	async findByIds(ids: string[]) {
		const rel = await this.model.find({ _id: ids, deleteAt: null }).exec();
		return this.toObjects(rel) || [];
	}

	/**
	 * 新增组件库
	 * @param data
	 * @param userId
	 * @returns
	 */
	async addLib(data: ComponentDto, userId: string) {
		const curr = await this.model.findOne({
			$or: [
				{
					name: data.name,
					version: data.version,
					userId,
					deleteAt: null,
				},
				{
					name: data.name,
					deleteAt: null,
					origin: 999,
				},
			]
		});
		if (curr) {
			AppError.assert(`${curr.name}@${curr.version} 已经存在`);
		}
		if (data.components.length === 0) {
			AppError.assert("No Components");
		}

		const { _id: id } = await this.model.create({
			...data,
			type: new mongoose.Types.ObjectId(data.type),
			createAt: new Date(),
			userId,
			origin: 1
		});
		return id;
	}

	/**
	 * 删除组件库
	 * @param id 
	 * @param userId 
	 * @returns 
	 */
	async deleteLib(id: string, userId: string) {
		return await this.model.updateOne({ _id: id, userId }, { deleteAt: new Date() });
	}

	/**
	 * 更新组件库
	 * @param data 
	 * @param userId 
	 * @returns 
	 */
	async updateLib(data: ComponentDto, userId: string) {
		const curr = await this.model.findOne({
			$or: [
				{
					name: data.name,
					version: data.version,
					userId,
					deleteAt: null,
				},
				{
					name: data.name,
					deleteAt: null,
					origin: 999,
				},
			]
		});
		if (curr && curr.id !== data.id) {
			AppError.assert(`${curr.name}@${curr.version} 已经存在`);
		}
		return await this.model.updateOne({ _id: data.id, userId }, { ...data, updateAt: new Date(), origin: 1 }, { omitUndefined: true });
	}

	async getIconFont(userId: string) {
		const rel = await this.iconModel.findOne({ userId });
		return this.toObject(rel);
	}

	async addIconFont(data: { url: string, type?: string }, userId: string) {
		const { _id: id } = await this.iconModel.create({
			url: data.url,
			type: data.type,
			userId
		});
		return id;
	}

	async updateIconFont(data: { url?: string, type?: string, id: string }, userId: string) {
		if (data.url) {
			return await this.iconModel.updateOne({ _id: data.id, userId }, {
				url: data.url,
				type: data.type,
			});
		} else {
			return await this.iconModel.deleteOne({ _id: data.id, userId })
		}
	}
}
