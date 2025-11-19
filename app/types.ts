export type ChatTab = '案件' | '雑談' | '詐欺';

export interface BaseMessage {
  id: string;
  nickname: string;
  timestamp: number;
  tab: ChatTab;
}

export interface ThreadComment {
  id: string;
  nickname: string;
  timestamp: number;
  content: string;
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

