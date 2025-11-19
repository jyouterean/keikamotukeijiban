'use client';

import { useEffect, useRef } from 'react';
import { ChatTab, Message } from '../types';
import ProjectForm from './ProjectForm';
import SimpleForm from './SimpleForm';

interface MobileFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
  activeTab: ChatTab;
  onSubmit: (message: Message) => void;
}

export default function MobileFormModal({
  isOpen,
  onClose,
  nickname,
  activeTab,
  onSubmit,
}: MobileFormModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (message: Message) => {
    onSubmit(message);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {activeTab === '案件' ? '案件を投稿' : 'メッセージを送信'}
        </h2>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="閉じる"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form Content */}
      <div ref={modalRef} className="h-[calc(100vh-64px)] overflow-y-auto">
        {activeTab === '案件' ? (
          <ProjectForm nickname={nickname} onSubmit={handleSubmit} />
        ) : (
          <SimpleForm nickname={nickname} tab={activeTab} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}

