'use client';

import { useState, useEffect, useRef } from 'react';
import { ProjectMessage, ThreadComment } from '../types';

interface ThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ProjectMessage;
  nickname: string;
  onAddComment: (messageId: string, comment: ThreadComment) => void;
  canViewAccounts?: boolean;
  onViewAccount?: (nickname: string) => void;
}

export default function ThreadModal({
  isOpen,
  onClose,
  message,
  nickname,
  onAddComment,
  canViewAccounts,
  onViewAccount,
}: ThreadModalProps) {
  const [commentContent, setCommentContent] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Scroll to bottom when new comments arrive
  useEffect(() => {
    if (isOpen) {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message.threadComments, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      return;
    }

    const newComment: ThreadComment = {
      id: Date.now().toString(),
      nickname,
      timestamp: Date.now(),
      content: commentContent.trim(),
    };

    onAddComment(message.id, newComment);
    setCommentContent('');
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        ref={modalRef}
        className="flex h-full max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 p-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{message.projectName}</h2>
            <p className="mt-1 text-sm text-gray-600">
              投稿者: {message.nickname}
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">電話番号:</span>
                <span className="ml-2 text-gray-900">{message.phoneNumber}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">料金:</span>
                <span className="ml-2 text-gray-900">{message.price}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">概要:</span>
                <p className="mt-1 whitespace-pre-wrap text-gray-900">{message.description}</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="閉じる"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Comments */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="mb-4 font-semibold text-gray-800">スレッド</h3>
          {message.threadComments && message.threadComments.length > 0 ? (
            <div className="space-y-3">
              {message.threadComments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{comment.nickname}</span>
                      {comment.verified && (
                        <button
                          onClick={() => canViewAccounts && onViewAccount?.(comment.nickname)}
                          className={canViewAccounts ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
                          disabled={!canViewAccounts}
                          title={canViewAccounts ? 'アカウント情報を見る' : ''}
                          aria-label={canViewAccounts ? 'アカウント情報を見る' : '認証済み'}
                        >
                          <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{formatTime(comment.timestamp)}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-gray-800">{comment.content}</p>
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">まだコメントがありません</p>
          )}
        </div>

        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="コメントを入力..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!commentContent.trim()}
              className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              送信
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

