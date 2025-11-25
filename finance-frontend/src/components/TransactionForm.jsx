import { useState } from 'react';
import api from '../utils/api';
import PropTypes from 'prop-types';

export default function TransactionForm({ refresh }) {
  const [form, setForm] = useState({
    amount: '',
    type: 'income',
    category: '',
    description: '',
    transaction_date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);

    const amount = Number.parseFloat(form.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than 0');
      setIsSubmitting(false);
      return;
    }

    const transactionData = {
      amount: amount,
      type: form.type,
      category: form.category || null,
      description: form.description || null,
      transaction_date: form.transaction_date
    };

    try {
      await api.post('/transactions', transactionData);
      setSuccess(true);
      setForm({ amount: '', type: 'income', category: '', description: '', transaction_date: '' });
      refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.userMessage || 'Failed to add transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
        Add Transaction
      </h3>
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
          Transaction added successfully!
        </div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div>
          <label htmlFor="amount" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
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
        <div>
          <label htmlFor="type" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Type
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              background: 'white',
              cursor: 'pointer',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label htmlFor="category" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Category
          </label>
          <input
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g., Food, Salary"
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
        <div>
          <label htmlFor="transaction_date" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Date
          </label>
          <input
            id="transaction_date"
            type="date"
            name="transaction_date"
            value={form.transaction_date}
            onChange={handleChange}
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
      </div>
      <div>
        <label htmlFor="description" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
          Description
        </label>
        <input
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Transaction description"
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px',
            marginBottom: '16px',
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
          width: '100%',
          padding: '14px',
          background: isSubmitting ? '#9CA3AF' : '#4F46E5',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
          opacity: isSubmitting ? 0.7 : 1
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
        {isSubmitting ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  );
}

TransactionForm.propTypes = {
  refresh: PropTypes.func.isRequired,
};
