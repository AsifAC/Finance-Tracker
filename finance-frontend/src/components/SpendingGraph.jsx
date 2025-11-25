import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import PropTypes from 'prop-types';

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function SpendingGraph({ transactions }) {
  const spendingData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const expenses = transactions.filter(t => t.type === 'expense');
    
    const grouped = {};
    expenses.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      const amount = Number.parseFloat(transaction.amount) || 0;
      
      if (!grouped[category]) {
        grouped[category] = 0;
      }
      grouped[category] += amount;
    });

    const data = Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        value: Math.round(value * 100) / 100,
      }))
      .sort((a, b) => b.value - a.value);

    return data;
  }, [transactions]);

  if (spendingData.length === 0) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: '#666',
        background: '#f8f9fa',
        borderRadius: '12px'
      }}>
        <p>No spending data available. Add expense transactions to see spending by category.</p>
      </div>
    );
  }

  const total = spendingData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
        Spending by Category
      </h3>
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a' }}>
          ${total.toLocaleString()}
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Spending</div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={spendingData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {spendingData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              background: '#1a1a1a', 
              border: 'none', 
              borderRadius: '8px',
              color: 'white'
            }}
            formatter={(value) => `$${value.toLocaleString()}`}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
        {spendingData.map((item, index) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '3px', 
              background: COLORS[index % COLORS.length] 
            }} />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              {item.name}: ${item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

SpendingGraph.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.string.isRequired,
      category: PropTypes.string,
    })
  ).isRequired,
};

