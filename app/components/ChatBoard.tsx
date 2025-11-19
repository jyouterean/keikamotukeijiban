'use client';

import { useState, useEffect } from 'react';
import { ChatTab, Message, ProjectMessage, SimpleMessage, ThreadComment, UserAccount } from '../types';
import ProjectForm from './ProjectForm';
import SimpleForm from './SimpleForm';
import MessageList from './MessageList';
import ThreadModal from './ThreadModal';
import MobileFormModal from './MobileFormModal';
import MobileSimpleForm from './MobileSimpleForm';
import AccountModal from './AccountModal';
import { useIsMobile } from '../hooks/useMediaQuery';

interface ChatBoardProps {
  nickname: string | null;
  account: UserAccount | null;
  onLogout: () => void;
  onCreateAccount: () => void;
  onShowNicknameSetup: () => void;
}

export default function ChatBoard({ nickname, account, onLogout, onCreateAccount, onShowNicknameSetup }: ChatBoardProps) {
  const [activeTab, setActiveTab] = useState<ChatTab>('案件');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedThread, setSelectedThread] = useState<ProjectMessage | null>(null);
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
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
    // Check if nickname exists
    if (!nickname) {
      onShowNicknameSetup();
      return;
    }
    
    // Add verified status if user has account
    const messageWithVerified = {
      ...message,
      verified: account?.verified || false,
    };
    setMessages(prev => [...prev, messageWithVerified]);
  };

  const handleAddThreadComment = (messageId: string, comment: ThreadComment) => {
    // Add verified status to comment
    const commentWithVerified = {
      ...comment,
      verified: account?.verified || false,
    };

    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId && msg.tab === '案件') {
          const projectMsg = msg as ProjectMessage;
          return {
            ...projectMsg,
            threadComments: [...(projectMsg.threadComments || []), commentWithVerified],
          };
        }
        return msg;
      })
    );

    // Update selected thread if it's open
    if (selectedThread && selectedThread.id === messageId) {
      setSelectedThread(prev => ({
        ...prev!,
        threadComments: [...(prev!.threadComments || []), commentWithVerified],
      }));
    }
  };

  const handleOpenThread = (message: ProjectMessage) => {
    // Find the latest version of the message
    const latestMessage = messages.find(m => m.id === message.id) as ProjectMessage;
    setSelectedThread(latestMessage || message);
  };

  const filteredMessages = messages.filter(msg => msg.tab === activeTab);

  const tabs: ChatTab[] = ['案件', '雑談'];

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-3">
          {isMobile ? (
            /* Mobile Header */
            <div className="space-y-2">
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold text-gray-800">軽貨物掲示板</h1>
                <div className="flex items-center gap-2">
                  {nickname && account && (
                    <button
                      onClick={() => setIsAccountModalOpen(true)}
                      className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
                    >
                      アカウント
                    </button>
                  )}
                  {nickname && (
                    <button
                      onClick={onLogout}
                      className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
                    >
                      ログアウト
                    </button>
                  )}
                </div>
              </div>
              {/* Bottom Row */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">ネーム:</span>
                  <span className="font-semibold text-gray-800">{nickname || '未設定'}</span>
                  {account?.verified && (
                    <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {!account && nickname && (
                  <button
                    onClick={onCreateAccount}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    作成
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* PC Header */
            <div className="flex items-center justify-between py-1">
              <h1 className="text-2xl font-bold text-gray-800">軽貨物掲示板</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">ニックネーム:</span>
                  <span className="font-semibold text-gray-800">{nickname || '未設定'}</span>
                  {account?.verified && (
                    <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {account ? (
                  <button
                    onClick={() => setIsAccountModalOpen(true)}
                    className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
                  >
                    アカウント
                  </button>
                ) : nickname && (
                  <button
                    onClick={onCreateAccount}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                  >
                    アカウント作成
                  </button>
                )}
                {nickname && (
                  <button
                    onClick={onLogout}
                    className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
                  >
                    ログアウト
                  </button>
                )}
              </div>
            </div>
          )}
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
        {isMobile && activeTab === '雑談' ? (
          /* Mobile Chat Layout with Fixed Input */
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <MessageList 
                messages={filteredMessages} 
                activeTab={activeTab}
                onOpenThread={handleOpenThread}
              />
            </div>
            <MobileSimpleForm 
              nickname={nickname || ''} 
              onSubmit={handleAddMessage}
            />
          </div>
        ) : (
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
                  <ProjectForm nickname={nickname || ''} onSubmit={handleAddMessage} />
                ) : (
                  <SimpleForm 
                    nickname={nickname || ''} 
                    tab={activeTab} 
                    onSubmit={handleAddMessage}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Floating Button (案件タブのみ) */}
      {isMobile && activeTab === '案件' && (
        <button
          onClick={() => setIsMobileFormOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Mobile Form Modal (案件タブのみ) */}
      {activeTab === '案件' && (
        <MobileFormModal
          isOpen={isMobileFormOpen}
          onClose={() => setIsMobileFormOpen(false)}
          nickname={nickname || ''}
          activeTab={activeTab}
          onSubmit={handleAddMessage}
        />
      )}

      {/* Thread Modal */}
      {selectedThread && (
        <ThreadModal
          isOpen={!!selectedThread}
          onClose={() => setSelectedThread(null)}
          message={selectedThread}
          nickname={nickname || ''}
          onAddComment={handleAddThreadComment}
        />
      )}

      {/* Account Modal */}
      {account && (
        <AccountModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          account={account}
        />
      )}
    </div>
  );
}

