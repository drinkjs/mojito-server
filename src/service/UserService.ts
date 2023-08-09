import UserEntity from "@/entity/UserEntity";
import { AppError, Injectable, MgModel, MgModelType } from "ngulf";
import BaseService from "./BaseService";

@Injectable()
export default class UserService extends BaseService {

  @MgModel(UserEntity)
  private model!: MgModelType<UserEntity>;

  async add(data: { name: string, email: string, from: string, authUserId?: string, avatarUrl?: string }) {
    const { name, email, from, authUserId, avatarUrl } = data;
    const rel = await this.model.findOne({ name, email, from }).exec();
    if (rel && rel._id) {
      return this.toObject(rel);;
    }
    const newUser = await this.model.create({
      from,
      name,
      email,
      authUserId,
      avatarUrl,
      createAt: new Date,
      lastLoginAt: new Date,
    });
    return this.toObject(newUser);
  }

  async getUserById(id: string) {
    const rel = await this.model.findById(id).exec();
    return this.toObject(rel);
  }

  async update(id: string, data: { name?: string, email?: string, lastLoginAt?: Date, avatarUrl?: string }) {
    const { name, email, lastLoginAt, avatarUrl } = data;
    return await this.model.updateOne({ _id: id }, { name, email, lastLoginAt, avatarUrl }, { omitUndefined: true })
  }
}