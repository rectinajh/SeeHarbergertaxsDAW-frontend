export interface IAdvertise {
  id: number;
  pcimage: string;
  mobimage: string;
  createdate: string;
  audstatus: AUD_STATUS;
  auddate: string;
  useraddr: string;
  audmsg: string;
  applymsg: string;
  page?: number;
  status?: AUD_STATUS;
}
export type ILinks = {
  next: string;
  previous: string;
};

export type IListRes = { results: IAdvertise[]; count: number; links: ILinks };

export enum AUD_STATUS {
  all = -1,
  pending = 2,
  fail = 1,
  success = 0,
}
export const AUD_STATUS_TEXT = {
  [AUD_STATUS.all]: "全部",
  [AUD_STATUS.pending]: "待审核",
  [AUD_STATUS.fail]: "审核失败",
  [AUD_STATUS.success]: "审核成功",
};

export const Tabs = [
  {
    label: "全部",
    key: AUD_STATUS.all,
  },
  {
    label: "待审核",
    key: AUD_STATUS.pending,
  },
  {
    label: "审核失败",
    key: AUD_STATUS.fail,
  },
  {
    label: "审核成功",
    key: AUD_STATUS.success,
  },
];
enum TradeState {
  UNLOCK,
  LOCK,
}

export interface IShdDetails {
  id: number;
  price: bigint;
  keeper: string;
  keeperReceiveTime: number;
  tradeTime: number;
  setPriceTime: number;
  tradeState: TradeState;
}

export interface UserInfo {
  id: number;
  username: string;
  auditor: boolean;
}
