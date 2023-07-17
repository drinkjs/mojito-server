import { modelOptions, mongoose, prop, Severity } from "ngulf/typegoose";

@modelOptions({ options: { customName: "component_type", allowMixed: Severity.ALLOW } })
export default class ComponentType {
  @prop({ required: true, unique: true })
  name!: string;

  @prop()
  pid?: mongoose.Types.ObjectId;

  @prop()
  icon?: string;

  @prop()
  createAt?: Date;

  @prop()
  updateAt?: Date;

  @prop({ select: false, default: null })
  deleteAt?: Date;
}
