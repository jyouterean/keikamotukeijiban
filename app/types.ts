export type ChatTab = '案件' | '雑談' | '詐欺';
export type AccountType = 'company' | 'driver';

export interface CompanyAccount {
  type: 'company';
  nickname: string;
  companyName: string;
  representativeName: string;
  driverCount?: string;
  phoneNumber: string;
  email?: string;
  verified: boolean;
}

export interface DriverAccount {
  type: 'driver';
  nickname: string;
  name: string;
  age: string;
  phoneNumber: string;
  email?: string;
  verified: boolean;
}

export type UserAccount = CompanyAccount | DriverAccount;

export interface BaseMessage {
  id: string;
  nickname: string;
  timestamp: number;
  tab: ChatTab;
  verified?: boolean;
}

export interface ThreadComment {
  id: string;
  nickname: string;
  timestamp: number;
  content: string;
  verified?: boolean;
}

export interface ProjectMessage extends BaseMessage {
  tab: '案件';
  projectName: string;
  phoneNumber: string;
  price: string;
  description: string;
  threadComments?: ThreadComment[];
}

export interface SimpleMessage extends BaseMessage {
  tab: '雑談' | '詐欺';
  content: string;
}

export type Message = ProjectMessage | SimpleMessage;

export interface RateLimitInfo {
  count: number;
  firstMessageTime: number;
  blockedUntil?: number;
}

