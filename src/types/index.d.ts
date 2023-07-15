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
  interface LayerInfo {
    name: string;
    initSize: boolean;
    style: Record<string, string | number>;
    component: string; // 只保存组件id
    updateFlag?: string | number;
    props?: { [key: string]: any };
    events?: { [key: string]: any };
    eventLock?: boolean;
    api?: string;
    isHide?: boolean;
    isLock?: boolean;
    group?: string;
    isGroupLock?: boolean;
    isGroupHide?: boolean;
    reloadKey?: number;
    anime?: { [key: string]: any };
    relativePosition?: {
      x?: RelativePosition;
      y?: RelativePosition;
    }; // 相对位置
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