import { prop } from "@ngulf/mongo";

export default class Project {
  @prop({ required: true, })
  name!: string;

  @prop()
  createAt?: Date;

  @prop()
  updateAt?: Date;

  @prop({required: true, select: false})
  userId!: string;

  @prop({ select: false, default: null })
  deleteAt?: Date;
}
