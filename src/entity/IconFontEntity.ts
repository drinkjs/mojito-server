import { modelOptions, prop } from "ngulf/typegoose";

@modelOptions({ options: { customName: "iconfont"} })
export default class IconFont {
  @prop()
  createAt?: Date;

  @prop()
  updateAt?: Date;

  @prop({required: true, select: false})
  userId!: string;

  @prop({required: false})
  url?: string;

  @prop({required: false})
  type?: string;
}