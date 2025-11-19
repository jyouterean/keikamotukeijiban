export type ChatTab = '案件' | '雑談' | '詐欺';

export interface BaseMessage {
  id: string;
  nickname: string;
  timestamp: number;
  tab: ChatTab;
}

export interface ProjectMessage extends BaseMessage {
  tab: '案件';
  projectName: string;
  phoneNumber: string;
  price: string;
  description: string;
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

