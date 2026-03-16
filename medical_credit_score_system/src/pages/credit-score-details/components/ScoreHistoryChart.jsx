import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const ScoreHistoryChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-elevation-3 p-3">
          <p className="text-sm font-caption text-foreground mb-1">{payload?.[0]?.payload?.date}</p>
          <p className="text-lg font-mono font-bold text-primary">{payload?.[0]?.value}</p>
          {payload?.[0]?.payload?.event && (
            <p className="text-xs text-muted-foreground mt-1">{payload?.[0]?.payload?.event}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6">
      <h3 className="font-heading font-semibold text-lg md:text-xl text-foreground mb-4">Score History</h3>
      <div className="w-full" aria-label="Credit Score History Line Chart" style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              domain={[0, 1000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              fill="url(#scoreGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScoreHistoryChart;