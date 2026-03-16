import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const useCountUp = (end, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return count;
};

const BillingSummaryCard = ({ label, value, icon, color, bgColor, isCurrency }) => {
  const displayValue = useCountUp(value);
  
  const formatValue = (val) => {
    if (isCurrency) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      })?.format(val);
    }
    return val;
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 border border-border p-4 md:p-6 transition-all duration-300 hover:shadow-elevation-3 hover:-translate-y-1 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 ${bgColor} rounded-full -mr-12 -mt-12 opacity-20 transition-transform group-hover:scale-110`}></div>
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className={`${bgColor} rounded-md p-2 shadow-sm`}>
          <Icon name={icon} size={24} color={color?.replace('text-', 'var(--color-')} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-2 relative z-10">{label}</p>
      <div className="flex items-baseline space-x-1 relative z-10">
        <p className={`font-mono font-bold text-2xl md:text-3xl ${color}`}>
          {formatValue(displayValue)}
        </p>
        {!isCurrency && label.includes('Time') && <span className="text-xs text-muted-foreground font-medium">days</span>}
        {!isCurrency && label.includes('Impact') && <span className="text-xs text-muted-foreground font-medium">pts</span>}
      </div>
    </div>
  );
};

const BillingSummary = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <BillingSummaryCard 
        label="Total Medical Expenses" 
        value={summary?.totalExpenses || 0} 
        icon="IndianRupee" 
        color="text-primary" 
        bgColor="bg-primary/10" 
        isCurrency={true}
      />
      <BillingSummaryCard 
        label="Total Outstanding" 
        value={summary?.totalOutstanding || 0} 
        icon="AlertCircle" 
        color="text-error" 
        bgColor="bg-error/10" 
        isCurrency={true}
      />
      <BillingSummaryCard 
        label="Average Payment Time" 
        value={summary?.avgPaymentTime || 0} 
        icon="Clock" 
        color="text-warning" 
        bgColor="bg-warning/10" 
      />
      <BillingSummaryCard 
        label="Credit Score Impact" 
        value={summary?.creditScoreContribution || 0} 
        icon="TrendingUp" 
        color="text-success" 
        bgColor="bg-success/10" 
      />
    </div>
  );
};

export default BillingSummary;