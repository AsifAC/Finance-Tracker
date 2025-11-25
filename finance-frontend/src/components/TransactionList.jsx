import PropTypes from 'prop-types';
import TransactionItem from './TransactionItem';

export default function TransactionList({ transactions, refresh }) {
  const displayTransactions = transactions.filter(t => t.type !== 'initial_networth');

  if (displayTransactions.length === 0) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          No transactions yet. Add your first transaction above!
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{
        margin: '0 0 20px 0',
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a1a1a'
      }}>
        Recent Transactions
      </h2>
      <div>
        {displayTransactions.map((t) => (
          <TransactionItem key={t.id} transaction={t} refresh={refresh} />
        ))}
      </div>
    </div>
  );
}

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  refresh: PropTypes.func.isRequired,
};
