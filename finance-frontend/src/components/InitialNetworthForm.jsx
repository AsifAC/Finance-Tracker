import { useState, useEffect } from 'react';
import api from '../utils/api';
import PropTypes from 'prop-types';

export default function InitialNetworthForm({ onNetworthSet }) {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasInitialNetworth, setHasInitialNetworth] = useState(false);

  useEffect(() => {
    checkInitialNetworth();
  }, []);

  const checkInitialNetworth = async () => {
    try {
      const res = await api.get('/transactions');
      const initialNetworth = res.data.find(t => t.type === 'initial_networth');
      if (initialNetworth) {
        setHasInitialNetworth(true);
        setAmount(initialNetworth.amount.toString());
      }
    } catch (error) {
      console.error('Error checking initial networth:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);

    const networthAmount = Number.parseFloat(amount);
    if (Number.isNaN(networthAmount)) {
      setError('Please enter a valid amount');
      setIsSubmitting(false);
      return;
    }

    const transactionData = {
      amount: Math.abs(networthAmount),
      type: 'initial_networth',
      category: 'Initial Balance',
      description: 'Initial networth',
      transaction_date: new Date().toISOString().split('T')[0]
    };

    try {
      if (hasInitialNetworth) {
        const res = await api.get('/transactions');
        const existing = res.data.find(t => t.type === 'initial_networth');
        if (existing) {
          await api.put(`/transactions/${existing.id}`, transactionData);
        }
      } else {
        await api.post('/transactions', transactionData);
      }
      
      setSuccess(true);
      setHasInitialNetworth(true);
      onNetworthSet();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.userMessage || 'Failed to set initial networth');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
        {hasInitialNetworth ? 'Update Initial Networth' : 'Set Initial Networth'}
      </h3>
      <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>
        Enter your starting networth to track your financial progress accurately.
      </p>
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            padding: '12px',
            background: '#FEE2E2',
            border: '1px solid #EF4444',
            borderRadius: '8px',
            color: '#DC2626',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{
            padding: '12px',
            background: '#D1FAE5',
            border: '1px solid #10B981',
            borderRadius: '8px',
            color: '#059669',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            Initial networth {hasInitialNetworth ? 'updated' : 'set'} successfully!
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="initial_networth" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
              Amount
            </label>
            <input
              id="initial_networth"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
                setSuccess(false);
              }}
              placeholder="0.00"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 24px',
              background: isSubmitting ? '#9CA3AF' : '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              if (!isSubmitting) e.target.style.background = '#4338CA';
            }}
            onMouseOut={(e) => {
              if (!isSubmitting) e.target.style.background = '#4F46E5';
            }}
            onFocus={(e) => {
              if (!isSubmitting) e.target.style.background = '#4338CA';
            }}
            onBlur={(e) => {
              if (!isSubmitting) e.target.style.background = '#4F46E5';
            }}
          >
            {(() => {
              if (isSubmitting) return 'Saving...';
              return hasInitialNetworth ? 'Update' : 'Set';
            })()}
          </button>
        </div>
      </form>
    </div>
  );
}

InitialNetworthForm.propTypes = {
  onNetworthSet: PropTypes.func.isRequired,
};
