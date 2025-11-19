'use client';

import { useState, useEffect } from 'react';
import { ChatTab, Message, ProjectMessage, SimpleMessage, ThreadComment } from '../types';
import ProjectForm from './ProjectForm';
import SimpleForm from './SimpleForm';
import MessageList from './MessageList';
import ThreadModal from './ThreadModal';
import MobileFormModal from './MobileFormModal';
import { useIsMobile } from '../hooks/useMediaQuery';

interface ChatBoardProps {
  nickname: string;
  onLogout: () => void;
}

export default function ChatBoard({ nickname, onLogout }: ChatBoardProps) {
  const [activeTab, setActiveTab] = useState<ChatTab>('案件');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedThread, setSelectedThread] = useState<ProjectMessage | null>(null);
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);
  const isMobile = useIsMobile();

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

  const handleAddThreadComment = (messageId: string, comment: ThreadComment) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId && msg.tab === '案件') {
          const projectMsg = msg as ProjectMessage;
          return {
            ...projectMsg,
            threadComments: [...(projectMsg.threadComments || []), comment],
          };
        }
        return msg;
      })
    );

    // Update selected thread if it's open
    if (selectedThread && selectedThread.id === messageId) {
      setSelectedThread(prev => ({
        ...prev!,
        threadComments: [...(prev!.threadComments || []), comment],
      }));
    }
  };

  const handleOpenThread = (message: ProjectMessage) => {
    // Find the latest version of the message
    const latestMessage = messages.find(m => m.id === message.id) as ProjectMessage;
    setSelectedThread(latestMessage || message);
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
          <MessageList 
            messages={filteredMessages} 
            activeTab={activeTab}
            onOpenThread={handleOpenThread}
          />

          {/* Input Form Area (PC only) */}
          {!isMobile && (
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
          )}
        </div>
      </div>

      {/* Mobile Floating Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileFormOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Mobile Form Modal */}
      <MobileFormModal
        isOpen={isMobileFormOpen}
        onClose={() => setIsMobileFormOpen(false)}
        nickname={nickname}
        activeTab={activeTab}
        onSubmit={handleAddMessage}
      />

      {/* Thread Modal */}
      {selectedThread && (
        <ThreadModal
          isOpen={!!selectedThread}
          onClose={() => setSelectedThread(null)}
          message={selectedThread}
          nickname={nickname}
          onAddComment={handleAddThreadComment}
        />
      )}
    </div>
  );
}

