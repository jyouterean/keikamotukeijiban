'use client';

import { useState, useEffect } from 'react';
import NicknameSetup from './components/NicknameSetup';
import ChatBoard from './components/ChatBoard';

export default function Home() {
  const [nickname, setNickname] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load nickname from localStorage
    const stored = localStorage.getItem('nickname');
    if (stored) {
      setNickname(stored);
    }
    setIsLoading(false);
  }, []);

  const handleNicknameComplete = (newNickname: string) => {
    localStorage.setItem('nickname', newNickname);
    setNickname(newNickname);
  };

  const handleLogout = () => {
    if (confirm('ログアウトしますか？')) {
      localStorage.removeItem('nickname');
      setNickname(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (!nickname) {
    return <NicknameSetup onComplete={handleNicknameComplete} />;
  }

  return <ChatBoard nickname={nickname} onLogout={handleLogout} />;
}
