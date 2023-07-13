import { prop } from "ngulf/typegoose";

export default class Project {
  @prop({ required: true })
  name!: string;

  @prop()
  createTime?: string;

  @prop()
  updateTime?: string;

  @prop()
  createUser?: string;

  @prop({ default: 0, select: false })
  status?:number; // 0:删除1正常;
}
