/* eslint-disable no-shadow */
import mongoose, { ToObjectOptions } from "ngulf/mongoose";

export default class BaseService {
  private transform<T extends mongoose.Document>(value: T, options?: ToObjectOptions):T {
    return value.toObject({
      versionKey: false,
      // eslint-disable-next-line no-unused-vars
      transform: (doc, ret, options) => {
        ret.id = doc.id;
        delete ret._id;
        return ret;
      },
      ...options,
    });
  }

  toObject<T=any>(value: mongoose.Document<any, any, T> | mongoose.Document<any, any, T>[] | null, options?: ToObjectOptions){
    if(!value) return null;
    if(Array.isArray(value)){
      return value.map(v => this.transform(v, options))
    }
    return this.transform(value, options)
  }
}
