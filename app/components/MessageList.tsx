'use client';

import { useEffect, useRef } from 'react';
import { Message, ChatTab, ProjectMessage, SimpleMessage } from '../types';

interface MessageListProps {
  messages: Message[];
  activeTab: ChatTab;
  onOpenThread?: (message: ProjectMessage) => void;
}

export default function MessageList({ messages, activeTab, onOpenThread }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  const renderProjectMessage = (message: ProjectMessage) => (
    <div key={message.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{message.projectName}</h3>
          <p className="mt-1 text-sm text-gray-600">
            投稿者: <span className="font-medium">{message.nickname}</span>
          </p>
        </div>
        <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">料金:</span>
          <span className="text-sm text-gray-900">{message.price}</span>
        </div>
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700">概要:</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">{message.description}</p>
        </div>
      </div>

      {/* Thread Button */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-500">
          {message.threadComments?.length || 0} 件のコメント
        </span>
        <button
          onClick={() => onOpenThread?.(message)}
          className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
        >
          スレッドを見る
        </button>
      </div>
    </div>
  );

  const renderSimpleMessage = (message: SimpleMessage) => (
    <div key={message.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between">
        <span className="font-medium text-gray-900">{message.nickname}</span>
        <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
      </div>
      <p className="whitespace-pre-wrap text-sm text-gray-800">{message.content}</p>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">まだメッセージがありません</p>
              <p className="mt-2 text-sm text-gray-400">
                右側のフォームから{activeTab === '案件' ? '案件を' : 'メッセージを'}投稿してください
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map(message => 
              message.tab === '案件'
                ? renderProjectMessage(message as ProjectMessage)
                : renderSimpleMessage(message as SimpleMessage)
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

