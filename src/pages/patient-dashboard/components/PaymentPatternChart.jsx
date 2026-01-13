import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PaymentPatternChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-semibold text-popover-foreground mb-2">
            {payload?.[0]?.payload?.month}
          </p>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              On Time: <span className="font-semibold text-success data-text">${payload?.[0]?.value?.toLocaleString()}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Late: <span className="font-semibold text-warning data-text">${payload?.[1]?.value?.toLocaleString()}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Missed: <span className="font-semibold text-error data-text">${payload?.[2]?.value?.toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-xl p-6 md:p-8 shadow-elevation-2">
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
          Payment Patterns
        </h2>
        <p className="text-sm text-muted-foreground caption">
          Payment behavior analysis
        </p>
      </div>

      <div className="w-full h-64 md:h-80" aria-label="Payment Pattern Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'var(--font-caption)' }}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'var(--font-data)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', fontFamily: 'var(--font-caption)' }}
              iconType="circle"
            />
            <Bar dataKey="onTime" fill="var(--color-success)" name="On Time" radius={[4, 4, 0, 0]} />
            <Bar dataKey="late" fill="var(--color-warning)" name="Late" radius={[4, 4, 0, 0]} />
            <Bar dataKey="missed" fill="var(--color-error)" name="Missed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentPatternChart;