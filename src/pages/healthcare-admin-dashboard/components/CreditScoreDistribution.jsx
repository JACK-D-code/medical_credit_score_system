import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CreditScoreDistribution = ({ data }) => {
  const COLORS = {
    excellent: '#10B981',
    good: '#3B82F6',
    fair: '#F59E0B',
    poor: '#EF4444'
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-popover-foreground">{payload?.[0]?.name}</p>
          <p className="text-sm text-muted-foreground">
            {payload?.[0]?.value} patients ({((payload?.[0]?.value / data?.reduce((sum, item) => sum + item?.value, 0)) * 100)?.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 shadow-elevation-1 border border-border">
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Credit Score Distribution</h3>
      <div className="w-full h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[entry?.category]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {data?.map((item) => (
          <div key={item?.category} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS?.[item?.category] }} />
              <span className="text-xs font-medium text-foreground capitalize">{item?.name}</span>
            </div>
            <p className="text-lg font-semibold text-foreground data-text">{item?.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditScoreDistribution;