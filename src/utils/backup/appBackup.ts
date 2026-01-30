type AppBackup = {
  version: string;
  timestamp: string;
  data: {
    user: unknown;
    balance: unknown;
    bank: unknown;
    heirloom: unknown;
    rewardHistory: unknown;
  };
};

export const createAppBackup = (): AppBackup => {
  return {
    version: '1.0',
    timestamp: new Date().toISOString(),
    data: {
      user: localStorage.getItem('user-storage'),
      balance: localStorage.getItem('balance-storage'),
      bank: localStorage.getItem('bank-storage'),
      heirloom: localStorage.getItem('heirloom-storage'),
      rewardHistory: localStorage.getItem('reward-history-storage'),
    },
  };
};

export const restoreAppBackup = (backup: AppBackup) => {
  if (!backup?.data) return;

  localStorage.setItem('user-storage', backup.data.user as string);
  localStorage.setItem('balance-storage', backup.data.balance as string);
  localStorage.setItem('bank-storage', backup.data.bank as string);
  localStorage.setItem('heirloom-storage', backup.data.heirloom as string);
  localStorage.setItem(
    'reward-history-storage',
    backup.data.rewardHistory as string
  );
};
