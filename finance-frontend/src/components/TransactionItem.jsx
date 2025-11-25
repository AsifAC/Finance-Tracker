import api from '../utils/api';
import PropTypes from 'prop-types';

export default function TransactionItem({ transaction, refresh }) {
  const handleDelete = async () => {
    try {
      await api.delete(`/transactions/${transaction.id}`);
      refresh();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert(error.userMessage || 'Failed to delete transaction. Please try again.');
    }
  };

  const amount = Number.parseFloat(transaction.amount) || 0;
  const isIncome = transaction.type === 'income';
  const date = new Date(transaction.transaction_date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <article style={{
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: isIncome ? '#D1FAE5' : '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            {isIncome ? '💰' : '💸'}
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
              {transaction.description || transaction.category || 'Transaction'}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {transaction.category && `${transaction.category} • `}{date}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '700',
          color: isIncome ? '#10B981' : '#EF4444'
        }}>
          {isIncome ? '+' : '-'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <button
          onClick={handleDelete}
          style={{
            background: 'transparent',
            border: '1px solid #e5e7eb',
            color: '#EF4444',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#FEE2E2';
            e.target.style.borderColor = '#EF4444';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.borderColor = '#e5e7eb';
          }}
          onFocus={(e) => {
            e.target.style.background = '#FEE2E2';
            e.target.style.borderColor = '#EF4444';
          }}
          onBlur={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.borderColor = '#e5e7eb';
          }}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    category: PropTypes.string,
    description: PropTypes.string,
    transaction_date: PropTypes.string.isRequired,
  }).isRequired,
  refresh: PropTypes.func.isRequired,
};
