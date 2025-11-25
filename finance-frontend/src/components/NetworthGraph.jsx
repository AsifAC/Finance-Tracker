import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import PropTypes from 'prop-types';

export default function NetworthGraph({ transactions }) {
  const networthData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const initialNetworthTransaction = transactions.find(t => t.type === 'initial_networth');
    const initialNetworth = initialNetworthTransaction 
      ? (Number.parseFloat(initialNetworthTransaction.amount) || 0) 
      : 0;

    const regularTransactions = transactions.filter(t => t.type !== 'initial_networth');

    const sorted = [...regularTransactions].sort((a, b) => 
      new Date(a.transaction_date) - new Date(b.transaction_date)
    );

    let networth = initialNetworth;
    
    const data = [];
    if (initialNetworth > 0 && initialNetworthTransaction) {
      data.push({
        date: new Date(initialNetworthTransaction.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        networth: Math.round(initialNetworth * 100) / 100,
        fullDate: initialNetworthTransaction.transaction_date
      });
    }

    sorted.forEach(transaction => {
      const amount = Number.parseFloat(transaction.amount) || 0;
      if (transaction.type === 'income') {
        networth += amount;
      } else if (transaction.type === 'expense') {
        networth -= amount;
      }
      data.push({
        date: new Date(transaction.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        networth: Math.round(networth * 100) / 100,
        fullDate: transaction.transaction_date
      });
    });

    return data;
  }, [transactions]);

  if (networthData.length === 0) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: '#666',
        background: '#f8f9fa',
        borderRadius: '12px'
      }}>
        <p>No data available. Add transactions to see your networth graph.</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
        Networth
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={networthData}>
          <defs>
            <linearGradient id="colorNetworth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ 
              background: '#1a1a1a', 
              border: 'none', 
              borderRadius: '8px',
              color: 'white'
            }}
            formatter={(value) => [`$${value.toLocaleString()}`, 'Networth']}
          />
          <Area 
            type="monotone" 
            dataKey="networth" 
            stroke="#4F46E5" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorNetworth)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

NetworthGraph.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.string.isRequired,
      transaction_date: PropTypes.string.isRequired,
    })
  ).isRequired,
};

