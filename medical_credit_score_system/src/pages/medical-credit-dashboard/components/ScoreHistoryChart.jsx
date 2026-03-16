import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Button from '../../../components/ui/Button';

const ScoreHistoryChart = ({ data = [] }) => {
  const [timeframe, setTimeframe] = useState('6months');

  const timeframeOptions = [
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' }
  ];

  const getFilteredData = () => {
    const now = new Date();
    let monthsBack = 6;

    switch (timeframe) {
      case '3months':
        monthsBack = 3;
        break;
      case '1year':
        monthsBack = 12;
        break;
      default:
        monthsBack = 6;
    }

    const cutoffDate = new Date(now.setMonth(now.getMonth() - monthsBack));
    return data?.filter(item => new Date(item.date) >= cutoffDate);
  };

  const filteredData = getFilteredData();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-md shadow-elevation-3 p-3">
          <p className="text-sm font-caption text-muted-foreground mb-1">
            {payload?.[0]?.payload?.date}
          </p>
          <p className="text-lg font-mono font-bold text-primary">
            {payload?.[0]?.value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-3 md:space-y-0">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
          Score History
        </h3>
        
        <div className="flex items-center space-x-2 overflow-x-auto">
          {timeframeOptions?.map((option) => (
            <Button
              key={option?.value}
              variant={timeframe === option?.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(option?.value)}
              className="flex-shrink-0"
            >
              {option?.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="w-full" style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              domain={[0, 1000]}
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
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