import { prop } from "@ngulf/mongo";

export default class User {
  @prop({ required: true })
  name!: string

  @prop({ required: false, default:null })
  email?: string

  @prop({ required: false, select: false })
  authUserId?: string

  @prop({ required: false })
  avatarUrl?: string

  @prop({ required: true })
  createAt!: Date

  @prop({ required: true })
  lastLoginAt!: Date

  @prop({ required: false, default: null, select: false })
  deleteAt?: Date

  @prop({ required: true, select: false })
  from!: string
}