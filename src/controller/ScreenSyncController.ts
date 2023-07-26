import { OPEN } from "ws";
import {
  Controller,
  Get,
  Query,
  WebSocketServer,
  WSS,
  WebsocketEvent,
  WsClient,
  WebsocketEmitter,
  BaseController,
} from "ngulf";
// import WebsocketEmitter, {
//   WebsocketEvent,
//   WsClient,
// } from "../core/WebsocketEmitter";

interface JoinPage {
  pageId: string;
}

interface StateSyncMsg {
  receiver: string[];
  data: { [key: string]: any };
}

interface SyncPageMsg {
  page: string;
  data: { [key: string]: any };
}

@Controller("/ws")
export default class ScreenSyncController extends BaseController {
  @WebSocketServer()
  private wss!: WebsocketEmitter;

  /**
   * 页面断开连接
   * @param target
   */
  @WSS(WebsocketEvent.disconnect)
  disconnect (target: WsClient) {
    console.log("页面断开连接", target.room);
  }

  /**
   * 页面加入房间
   */
  @WSS("/join")
  join (data: JoinPage, target: WsClient) {
    const { pageId } = data;
    if (pageId) {
      target.room = pageId;
    }
    target.data = data;
  
    const clients = this.getRoomClients(pageId)
  }

  /**
   * 组件状态同步
   */
  @WSS("/sync")
  sync (data: StateSyncMsg, target: WsClient) {
    const { room } = target;
    this.sendAll(
      room,
      {
        event: "sync",
        data,
      },
      target.id
    );
  }

  /**
   * 数据同步到指定页面
   * @param {*} data
   * @param {*} target
   */
  @WSS("/syncPage")
  syncPage (data: SyncPageMsg, target: WsClient) {
    const { room, data: targetData } = target;
    this.sendAll(
      room,
      {
        event: "syncPage",
        data,
      },
      targetData.pageId
    );
  }

  /**
   * 房间连接信息
   * @param room
   */
  getRoomClients (room: string) {
    return this.wss.getClientsByRoom(room) || [];
  }

  /**
   * 向同一房间的所有连接发送消息
   * @param {object} msg 消息对象
   * @param {string} room 房间号
   * @param {string} filterId 过滤客户端id
   */
  sendAll (room: string, msg: any, filterId?: string) {
    // 发送信息到客户端
    const clients = this.getRoomClients(room);
    clients.forEach((client) => {
      if (client.id !== filterId) this.sendMessage(client, msg);
    });
  }

  /**
   * 向指定连接发送消息
   * @param {object} client 客户端websocket连接对象
   * @param {object} msg 消息对象
   */
  sendMessage (client: WsClient, msg: any) {
    try {
      if (client && client.socket && client.socket.readyState === OPEN) {
        const msgString = JSON.stringify(msg);
        client.socket.send(msgString, (err: any) => {
          if (err) {
            console.error(err);
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
}
