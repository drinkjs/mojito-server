import ProjectEntity from "@/entity/ProjectEntity";
import ScreenEntity from "@/entity/ScreenEntity";
import UserEntity from "@/entity/UserEntity";
import { AppError, Injectable, MgModel, MgModelType } from "ngulf";
import BaseService from "./BaseService";

@Injectable()
export default class UserService extends BaseService {
	@MgModel(UserEntity)
	private model!: MgModelType<UserEntity>;

	@MgModel(ProjectEntity)
	private projectModel!: MgModelType<ProjectEntity>;

	@MgModel(ScreenEntity)
	private screenModel!: MgModelType<ScreenEntity>;

	async add(data: {
		name: string;
		email: string;
		from: string;
		authUserId?: string;
		avatarUrl?: string;
	}) {
		const { name, email, from, authUserId, avatarUrl } = data;
		const rel = await this.model.findOne({ name, email, from }).exec();
		if (rel && rel._id) {
			return this.toObject(rel);
		}
		// 创建新用户
		const newUser = await this.model.create({
			from,
			name,
			email,
			authUserId,
			avatarUrl,
			createAt: new Date(),
			lastLoginAt: new Date(),
		});

		// 创建默目项目
		const defaultProject = await this.projectModel.create({
			name: "Demo",
			userId: newUser.id,
			createAt: new Date(),
		});

		// 创建默认页面
		const page = await this.screenModel.findById("64d0b9bd01518b923582fa3e");
    if(page){
      const { name, style, layers, coverImg } = page;
		  await this.screenModel.create({
        projectId: defaultProject.id,
        userId: newUser.id,
        name,
        style,
        layers,
        coverImg,
        createAt: new Date(),
        updateAt: new Date(),
      });
    }
		
		return this.toObject(newUser);
	}

	async getUserById(id: string) {
		const rel = await this.model.findById(id).exec();
		return this.toObject(rel);
	}

	async update(
		id: string,
		data: {
			name?: string;
			email?: string;
			lastLoginAt?: Date;
			avatarUrl?: string;
		}
	) {
		const { name, email, lastLoginAt, avatarUrl } = data;
		return await this.model.updateOne(
			{ _id: id },
			{ name, email, lastLoginAt, avatarUrl },
			{ omitUndefined: true }
		);
	}
}
