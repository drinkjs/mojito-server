import { ObjectId } from "ngulf/mongoose";
import { Ref, modelOptions, mongoose, prop, Severity } from "ngulf/typegoose";

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export default class Screen {
  @prop({ required: true, type:mongoose.Schema.Types.ObjectId  })
  projectId!: string

  @prop({ required: true })
  name!: string;

  @prop({ type: mongoose.Schema.Types.Mixed })
  style?: ScreenOptions;

  @prop()
  createAt?: Date;

  @prop()
  updateAt?: Date;

  @prop()
  coverImg?: string;

  @prop()
  layers?: Layer[];

  @prop({ select: false, default: null })
  deleteAt?: Date;
}
