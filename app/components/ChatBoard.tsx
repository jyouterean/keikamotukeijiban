'use client';

import { useState, useEffect } from 'react';
import { ChatTab, Message, ProjectMessage, SimpleMessage } from '../types';
import ProjectForm from './ProjectForm';
import SimpleForm from './SimpleForm';
import MessageList from './MessageList';

interface ChatBoardProps {
  nickname: string;
  onLogout: () => void;
}

export default function ChatBoard({ nickname, onLogout }: ChatBoardProps) {
  const [activeTab, setActiveTab] = useState<ChatTab>('案件');
  const [messages, setMessages] = useState<Message[]>([]);

  // Load messages from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('messages');
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load messages:', e);
      }
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  const handleAddMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const filteredMessages = messages.filter(msg => msg.tab === activeTab);

  const tabs: ChatTab[] = ['案件', '雑談', '詐欺'];

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">軽貨物掲示板</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              ニックネーム: <span className="font-semibold text-gray-800">{nickname}</span>
            </span>
            <button
              onClick={onLogout}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-3 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* Messages Area */}
          <MessageList messages={filteredMessages} activeTab={activeTab} />

          {/* Input Form Area */}
          <div className="w-96 border-l border-gray-200 bg-white">
            {activeTab === '案件' ? (
              <ProjectForm nickname={nickname} onSubmit={handleAddMessage} />
            ) : (
              <SimpleForm 
                nickname={nickname} 
                tab={activeTab} 
                onSubmit={handleAddMessage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

