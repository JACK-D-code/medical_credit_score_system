import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const RiskAnalyticsPanel = ({ portfolioData, creditDistribution, defaultTrends }) => {
  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon name="TrendingUp" size={20} color="var(--color-accent)" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">Risk Analytics</h2>
          <p className="text-sm text-muted-foreground caption">Portfolio performance metrics</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="DollarSign" size={18} color="var(--color-primary)" />
            <p className="text-xs text-muted-foreground caption">Total Portfolio</p>
          </div>
          <p className="text-2xl md:text-3xl font-semibold text-foreground data-text">
            ${portfolioData?.totalAmount?.toLocaleString()}
          </p>
          <p className="text-xs text-success mt-1">+12.5% from last month</p>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="AlertTriangle" size={18} color="var(--color-warning)" />
            <p className="text-xs text-muted-foreground caption">Default Rate</p>
          </div>
          <p className="text-2xl md:text-3xl font-semibold text-foreground data-text">
            {portfolioData?.defaultRate}%
          </p>
          <p className="text-xs text-success mt-1">-2.3% from last month</p>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Users" size={18} color="var(--color-secondary)" />
            <p className="text-xs text-muted-foreground caption">Active Loans</p>
          </div>
          <p className="text-2xl md:text-3xl font-semibold text-foreground data-text">
            {portfolioData?.activeLoans}
          </p>
          <p className="text-xs text-success mt-1">+45 new applications</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-base font-semibold text-foreground mb-4">Credit Score Distribution</h3>
          <div className="w-full h-64" aria-label="Credit Score Distribution Pie Chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={creditDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {creditDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-foreground mb-4">Default Rate Trends</h3>
          <div className="w-full h-64" aria-label="Default Rate Trends Line Chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={defaultTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="defaultRate"
                  stroke="var(--color-error)"
                  strokeWidth={2}
                  name="Default Rate (%)"
                />
                <Line
                  type="monotone"
                  dataKey="approvalRate"
                  stroke="var(--color-success)"
                  strokeWidth={2}
                  name="Approval Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalyticsPanel;