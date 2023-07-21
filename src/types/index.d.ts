import mongoose from "ngulf/mongoose";

declare global {

  interface LayerApi {
    url: string;
    method: string;
    interval?: number;
    params?: {
      [key: string]: any;
    };
  }

  interface RelativePosition {
    layerId: string;
    offset: number;
    positionType: "left" | "right" | "top" | "bottom";
  }

  interface ScreenOptions {
    width: number;
    height: number;
    backgroundColor?: string;
    color?: string;
    backgroundImage?: string;
    backgroundRepeat?: string;
    fontFamily?: string;
    fontSize?: string;
  }
  
  type LayerEvent = {
    [key: string]: { code: string; isSync: boolean };
  }
  
  type Layer = {
    id:string,
    name:string,
    style:Record<string, any>
    props?: Record<string, any>
    eventHandler?: LayerEvent;
    eventLock?: boolean; // 事件锁定，锁定后图层内组件不能交互
    hide?: boolean;
    lock?: boolean;
    group?: string;
    isFirst?: boolean;
    component:{
      export: string;
      name: string;
      packId:string;
    }
  }

  interface DatasourceInfo {
    id: mongoose.Types.ObjectId;
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database?: string;
  }
}