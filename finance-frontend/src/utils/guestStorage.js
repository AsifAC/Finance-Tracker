const GUEST_STORAGE_KEY = 'guestTransactions';

export const getGuestTransactions = () => {
  const stored = localStorage.getItem(GUEST_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveGuestTransaction = (transaction) => {
  const transactions = getGuestTransactions();
  const newTransaction = {
    ...transaction,
    id: Date.now().toString(),
    user_id: 'guest'
  };
  transactions.push(newTransaction);
  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(transactions));
  return newTransaction;
};

export const deleteGuestTransaction = (id) => {
  const transactions = getGuestTransactions();
  const filtered = transactions.filter(t => t.id !== id.toString());
  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(filtered));
};

export const updateGuestTransaction = (id, updates) => {
  const transactions = getGuestTransactions();
  const index = transactions.findIndex(t => t.id === id.toString());
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates };
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(transactions));
    return transactions[index];
  }
  return null;
};

