'use client';

import { useState } from 'react';

interface NicknameSetupProps {
  onComplete: (nickname: string) => void;
  onLogin: () => void;
}

export default function NicknameSetup({ onComplete, onLogin }: NicknameSetupProps) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nickname.trim().length === 0) {
      setError('ニックネームを入力してください');
      return;
    }
    
    if (nickname.trim().length > 20) {
      setError('ニックネームは20文字以内で入力してください');
      return;
    }
    
    onComplete(nickname.trim());
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">軽貨物掲示板</h1>
          <p className="text-gray-600">ご利用前にニックネームを設定してください</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nickname" className="mb-2 block text-sm font-medium text-gray-700">
              ニックネーム
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError('');
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="ニックネームを入力"
              maxLength={20}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            チャットを始める
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">または</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogin}
            className="w-full rounded-lg border-2 border-indigo-600 bg-white px-4 py-3 font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            ログイン（アカウント作成）
          </button>
        </form>
      </div>
    </div>
  );
}

