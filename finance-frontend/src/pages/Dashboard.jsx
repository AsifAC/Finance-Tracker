import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { getGuestTransactions } from '../utils/guestStorage';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import InitialNetworthForm from '../components/InitialNetworthForm';
import NetworthGraph from '../components/NetworthGraph';
import IncomeExpenseGraph from '../components/IncomeExpenseGraph';
import SpendingGraph from '../components/SpendingGraph';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    if (user?.isGuest) {
      const guestTransactions = getGuestTransactions();
      setTransactions(guestTransactions);
    } else {
      try {
        const res = await api.get('/transactions');
        setTransactions(res.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadTransactions = async () => {
      if (user?.isGuest) {
        const guestTransactions = getGuestTransactions();
        if (isMounted) {
          setTransactions(guestTransactions);
        }
      } else {
        try {
          const res = await api.get('/transactions');
          if (isMounted) {
            setTransactions(res.data);
          }
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      }
    };
    loadTransactions();
    return () => { isMounted = false; };
  }, [user]);

  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (Number.parseFloat(t.amount) || 0), 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (Number.parseFloat(t.amount) || 0), 0);
    
    const initialNetworthTransaction = transactions.find(t => t.type === 'initial_networth');
    const initialNetworth = initialNetworthTransaction 
      ? (Number.parseFloat(initialNetworthTransaction.amount) || 0) 
      : 0;
    
    const networth = initialNetworth + income - expenses;

    return {
      income: Math.round(income * 100) / 100,
      expenses: Math.round(expenses * 100) / 100,
      initialNetworth: Math.round(initialNetworth * 100) / 100,
      networth: Math.round(networth * 100) / 100,
    };
  }, [transactions]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8F9FA',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '8px'
            }}>
              Buckaroo
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#6b7280'
            }}>
              {user?.isGuest ? 'Guest Mode - Data stored locally' : `Welcome back, ${user?.name || user?.email}!`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user?.avatar_url && (
              <img 
                src={user.avatar_url} 
                alt={user.name}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%'
                }}
              />
            )}
            <button
              onClick={logout}
              style={{
                padding: '10px 20px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                color: '#6b7280',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#EF4444';
                e.target.style.color = '#EF4444';
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.color = '#6b7280';
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <InitialNetworthForm onNetworthSet={fetchTransactions} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Total Income
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#10B981'
            }}>
              ${summary.income.toLocaleString()}
            </div>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Total Expenses
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#EF4444'
            }}>
              ${summary.expenses.toLocaleString()}
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
            color: 'white'
          }}>
            <div style={{
              fontSize: '14px',
              marginBottom: '8px',
              fontWeight: '500',
              opacity: 0.9
            }}>
              Networth
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700'
            }}>
              ${summary.networth.toLocaleString()}
            </div>
            {summary.initialNetworth > 0 && (
              <div style={{
                fontSize: '12px',
                marginTop: '8px',
                opacity: 0.8
              }}>
                Starting: ${summary.initialNetworth.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <NetworthGraph transactions={transactions} />
          <IncomeExpenseGraph transactions={transactions} />
        </div>

        <div style={{
          marginBottom: '32px'
        }}>
          <SpendingGraph transactions={transactions} />
        </div>

        <div style={{
          marginBottom: '32px'
        }}>
          <TransactionForm refresh={fetchTransactions} />
        </div>

        <div>
          <TransactionList transactions={transactions} refresh={fetchTransactions} />
        </div>
      </div>
    </div>
  );
}
