'use client';

import { useState, useEffect } from 'react';
import { ChatTab, SimpleMessage, RateLimitInfo } from '../types';

interface SimpleFormProps {
  nickname: string;
  tab: '雑談' | '詐欺';
  onSubmit: (message: SimpleMessage) => void;
}

// Rate limiting config: 5 messages per 30 seconds, block for 60 seconds
const RATE_LIMIT_MESSAGES = 5;
const RATE_LIMIT_WINDOW = 30 * 1000; // 30 seconds
const BLOCK_DURATION = 60 * 1000; // 60 seconds

export default function SimpleForm({ nickname, tab, onSubmit }: SimpleFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [rateLimit, setRateLimit] = useState<RateLimitInfo>({
    count: 0,
    firstMessageTime: 0,
  });
  const [remainingBlockTime, setRemainingBlockTime] = useState(0);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  // Update remaining block time and isBlocked state
  useEffect(() => {
    if (!rateLimit.blockedUntil) {
      setRemainingBlockTime(0);
      setIsBlocked(false);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, rateLimit.blockedUntil! - now);
      setRemainingBlockTime(remaining);
      
      // Update isBlocked state based on remaining time
      const blocked = rateLimit.blockedUntil !== undefined && now < rateLimit.blockedUntil;
      setIsBlocked(blocked);

      if (remaining === 0) {
        setRateLimit(prev => ({
          ...prev,
          blockedUntil: undefined,
          count: 0,
        }));
        setIsBlocked(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [rateLimit.blockedUntil]);

  // Load rate limit from localStorage
  useEffect(() => {
    const key = `rateLimit_${tab}_${nickname}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setRateLimit(data);
        // Update isBlocked state based on loaded data
        if (data.blockedUntil) {
          const blocked = Date.now() < data.blockedUntil;
          setIsBlocked(blocked);
        } else {
          setIsBlocked(false);
        }
      } catch (e) {
        console.error('Failed to load rate limit:', e);
      }
    }
  }, [tab, nickname]);

  // Save rate limit to localStorage
  useEffect(() => {
    const key = `rateLimit_${tab}_${nickname}`;
    localStorage.setItem(key, JSON.stringify(rateLimit));
  }, [rateLimit, tab, nickname]);

  const checkRateLimit = (): boolean => {
    const now = Date.now();

    // Check if currently blocked
    if (rateLimit.blockedUntil && now < rateLimit.blockedUntil) {
      const remainingSeconds = Math.ceil((rateLimit.blockedUntil - now) / 1000);
      setError(`連投制限中です。あと${remainingSeconds}秒お待ちください。`);
      return false;
    }

    // Reset if window has passed
    if (now - rateLimit.firstMessageTime > RATE_LIMIT_WINDOW) {
      setRateLimit({
        count: 1,
        firstMessageTime: now,
      });
      return true;
    }

    // Check if limit exceeded
    if (rateLimit.count >= RATE_LIMIT_MESSAGES) {
      const blockedUntil = now + BLOCK_DURATION;
      setRateLimit(prev => ({
        ...prev,
        blockedUntil,
      }));
      setIsBlocked(true);
      setError(`連投が多すぎます。${BLOCK_DURATION / 1000}秒間投稿できません。`);
      return false;
    }

    // Increment count
    setRateLimit(prev => ({
      ...prev,
      count: prev.count + 1,
    }));

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('メッセージを入力してください');
      return;
    }

    if (!checkRateLimit()) {
      return;
    }

    const message: SimpleMessage = {
      id: Date.now().toString(),
      nickname,
      timestamp: Date.now(),
      tab,
      content: content.trim(),
    };

    onSubmit(message);
    setContent('');
    setError('');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h2 className="font-semibold text-gray-800">メッセージを送信</h2>
        {isBlocked && remainingBlockTime > 0 && (
          <p className="mt-1 text-xs text-red-600">
            連投制限中: あと {Math.ceil(remainingBlockTime / 1000)} 秒
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700">
            メッセージ
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError('');
            }}
            rows={10}
            disabled={isBlocked}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            placeholder={isBlocked ? '連投制限中...' : 'メッセージを入力してください'}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="mt-4">
          <button
            type="submit"
            disabled={isBlocked}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isBlocked ? '送信制限中' : '送信する'}
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-yellow-50 p-3">
          <p className="text-xs text-yellow-800">
            注意: {RATE_LIMIT_WINDOW / 1000}秒間に{RATE_LIMIT_MESSAGES}件以上送信すると、
            {BLOCK_DURATION / 1000}秒間投稿できなくなります。
          </p>
        </div>
      </form>
    </div>
  );
}

