'use client';

import { useState } from 'react';
import { SimpleMessage } from '../types';

interface MobileSimpleFormProps {
  nickname: string;
  onSubmit: (message: SimpleMessage) => void;
}

export default function MobileSimpleForm({ nickname, onSubmit }: MobileSimpleFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    const message: SimpleMessage = {
      id: Date.now().toString(),
      nickname,
      timestamp: Date.now(),
      tab: '雑談',
      content: content.trim(),
      verified: false,
    };

    onSubmit(message);
    setContent('');
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-end gap-2 border-t border-gray-200 bg-white p-3"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="メッセージを入力..."
        rows={1}
        className="flex-1 resize-none rounded-full border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <button
        type="submit"
        disabled={!content.trim()}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  );
}

