'use client';

import { useState, useEffect } from 'react';
import NicknameSetup from './components/NicknameSetup';
import AccountForm from './components/AccountForm';
import ChatBoard from './components/ChatBoard';
import { UserAccount } from './types';
import { saveAccountToGlobal } from './utils/accountStorage';

type AppState = 'loading' | 'setup' | 'accountForm' | 'chat';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [nickname, setNickname] = useState<string | null>(null);
  const [account, setAccount] = useState<UserAccount | null>(null);

  useEffect(() => {
    // Load nickname and account from localStorage
    const storedNickname = localStorage.getItem('nickname');
    const storedAccount = localStorage.getItem('account');
    
    if (storedNickname) {
      setNickname(storedNickname);
      if (storedAccount) {
        try {
          setAccount(JSON.parse(storedAccount));
        } catch (e) {
          console.error('Failed to load account:', e);
        }
      }
    }
    // Always show chat board (even without nickname)
    setAppState('chat');
  }, []);

  const handleNicknameComplete = (newNickname: string) => {
    localStorage.setItem('nickname', newNickname);
    setNickname(newNickname);
    setAppState('chat');
  };

  const handleShowNicknameSetup = () => {
    setAppState('setup');
  };

  const handleShowAccountForm = () => {
    setAppState('accountForm');
  };

  const handleAccountFormComplete = (newAccount: UserAccount) => {
    localStorage.setItem('account', JSON.stringify(newAccount));
    localStorage.setItem('nickname', newAccount.nickname);
    // Save to global accounts storage
    saveAccountToGlobal(newAccount);
    setAccount(newAccount);
    setNickname(newAccount.nickname);
    setAppState('chat');
  };

  const handleAccountFormCancel = () => {
    if (nickname) {
      setAppState('chat');
    } else {
      setAppState('setup');
    }
  };

  const handleCreateAccount = () => {
    setAppState('accountForm');
  };

  const handleLogout = () => {
    if (confirm('ログアウトしますか？')) {
      localStorage.removeItem('nickname');
      localStorage.removeItem('account');
      setNickname(null);
      setAccount(null);
      // Stay on chat page after logout
    }
  };

  if (appState === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (appState === 'setup') {
    return (
      <NicknameSetup 
        onComplete={handleNicknameComplete}
        onLogin={handleShowAccountForm}
      />
    );
  }

  if (appState === 'accountForm') {
    return (
      <AccountForm 
        onComplete={handleAccountFormComplete}
        onCancel={handleAccountFormCancel}
      />
    );
  }

  return (
    <ChatBoard 
      nickname={nickname}
      account={account}
      onLogout={handleLogout}
      onCreateAccount={handleCreateAccount}
      onShowNicknameSetup={handleShowNicknameSetup}
    />
  );
}
