import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const ScoreEvolutionChart = ({ data }) => {
  const [timeRange, setTimeRange] = useState('6m');

  const timeRanges = [
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: '1y', label: '1 Year' },
    { value: 'all', label: 'All Time' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground">{payload?.[0]?.payload?.month}</p>
          <p className="text-sm text-muted-foreground">
            Score: <span className="font-semibold text-primary">{payload?.[0]?.value}</span>
          </p>
          {payload?.[0]?.payload?.event && (
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">{payload?.[0]?.payload?.event}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
          Score Evolution
        </h3>
        <div className="flex gap-2">
          {timeRanges?.map((range) => (
            <button
              key={range?.value}
              onClick={() => setTimeRange(range?.value)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-250 ${
                timeRange === range?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {range?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full h-64 md:h-80 lg:h-96" aria-label="Medical Credit Score Evolution Chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              tick={{ fill: 'var(--color-muted-foreground)' }}
            />
            <YAxis
              domain={[300, 850]}
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
              tick={{ fill: 'var(--color-muted-foreground)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="var(--color-primary)"
              strokeWidth={3}
              fill="url(#scoreGradient)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScoreEvolutionChart;