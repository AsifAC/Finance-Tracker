import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import PropTypes from 'prop-types';

export default function IncomeExpenseGraph({ transactions }) {
  const incomeExpenseData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const grouped = {};
    for (const transaction of transactions) {
      const fullDate = transaction.transaction_date;
      const dateKey = fullDate;
      const dateDisplay = new Date(fullDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const amount = Number.parseFloat(transaction.amount) || 0;
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: dateDisplay, fullDate, income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        grouped[dateKey].income += amount;
      } else {
        grouped[dateKey].expense += amount;
      }
    }

    const data = Object.values(grouped).sort((a, b) => 
      new Date(a.fullDate) - new Date(b.fullDate)
    );

    return data.map(item => ({
      ...item,
      income: Math.round(item.income * 100) / 100,
      expense: Math.round(item.expense * 100) / 100,
    }));
  }, [transactions]);

  if (incomeExpenseData.length === 0) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: '#666',
        background: '#f8f9fa',
        borderRadius: '12px'
      }}>
        <p>No data available. Add transactions to see income and expenses.</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
        Income vs Expenses
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={incomeExpenseData}>
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
            formatter={(value) => `$${value.toLocaleString()}`}
          />
          <Legend />
          <Bar dataKey="income" fill="#10B981" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expense" fill="#EF4444" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

IncomeExpenseGraph.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.string.isRequired,
      transaction_date: PropTypes.string.isRequired,
    })
  ).isRequired,
};

