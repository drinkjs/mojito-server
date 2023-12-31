import { index, modelOptions, mongoose, prop, Severity } from "@ngulf/mongo";

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@index({ name: 1, version:1 }, { unique: true })
export default class Component {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  packJson!: string;

  @prop({ required: true })
  version!: string;

  @prop({ required: true })
  components!: {export:string, name:string}[];

  @prop({ required: true })
  type!: mongoose.Types.ObjectId;

  @prop()
  cover?: string;

  @prop()
  createAt?: Date;

  @prop()
  updateAt?: Date;

  @prop({default: null, select: false})
  deleteAt?: Date;

  @prop({ required: true, select: false })
  userId!: string;

  @prop({ default: 1, type: Number })
  origin!: 1 | 999; // 来源:999系统， 1用户

  @prop()
  external?:Record<string, string>
}
