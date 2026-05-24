export interface Order {
  _id: string;
  time: string;
  orderNum: string;
  platform: string;
  payWay: string;
  depositePayWay: string;
  adultNum: number;
  childNum: number;
  accidentNum: number;
  totalMoney: number;
  deposite: number;
  isReback: string;
  ifFinish: string;
  saler: string;
  phoneNumber: string;
}

export interface Price {
  _id: string;
  adultPrice: number;
  childPrice: number;
  plupPrice: number;
  clothPrice: number;
}

export interface User {
  _id: string;
  username: string;
  password: string;
  orders: number;
  powerId: string;
}

export interface StoreItem {
  _id: string;
  name: string;
  total: number;
}

export interface UserMessage {
  username: string;
  powerId: string;
}
