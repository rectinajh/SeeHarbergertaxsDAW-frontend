export interface IAdvertise {
  id: number;
  pcimage: string;
  mobimage: string;
  createdate: string;
  audstatus: number;
  auddate: string;
  useraddr: string;
}

export enum AUD_STATUS {
  all = -1,
  pending = 2,
  fail = 1,
  success = 0,
}
