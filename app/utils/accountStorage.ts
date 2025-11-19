import { UserAccount } from '../types';

// All accounts storage key
const ACCOUNTS_KEY = 'all_accounts';

// Save an account to the global accounts list
export function saveAccountToGlobal(account: UserAccount): void {
  const accounts = getAllAccounts();
  
  // Update or add the account
  const existingIndex = accounts.findIndex(
    (a) => a.nickname === account.nickname
  );
  
  if (existingIndex >= 0) {
    accounts[existingIndex] = account;
  } else {
    accounts.push(account);
  }
  
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

// Get all accounts
export function getAllAccounts(): UserAccount[] {
  try {
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load accounts:', e);
  }
  return [];
}

// Get account by nickname
export function getAccountByNickname(nickname: string): UserAccount | null {
  const accounts = getAllAccounts();
  return accounts.find((a) => a.nickname === nickname) || null;
}

