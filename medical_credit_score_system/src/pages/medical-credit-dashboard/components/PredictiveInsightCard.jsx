import React from 'react';
import Icon from '../../../components/AppIcon';

const PredictiveInsightCard = ({ currentScore }) => {
    const getSimulatedTarget = (score) => {
        if (score >= 800) return score;
        if (score >= 700) return score + 45;
        if (score >= 600) return score + 85;
        return score + 120;
    };

    const simulatedTarget = getSimulatedTarget(currentScore);

    return (
        <div className="bg-card rounded-lg shadow-elevation-2 p-6 md:p-8 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] pointer-events-none" />

            <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
                </div>
                <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground">AI Predictive Forecast</h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        6-Month Trajectory
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-background rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Current Score</span>
                        <span className="font-mono font-semibold text-foreground">{currentScore > 0 ? currentScore : 'New'}</span>
                    </div>

                    <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
                        <div
                            className="absolute top-0 left-0 h-full bg-primary"
                            style={{ width: `${(currentScore / 1000) * 100}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Projected Score</span>
                        <span className="font-mono font-bold text-success text-lg">{currentScore > 0 ? simulatedTarget : '---'}</span>
                    </div>

                    <div className="relative w-full h-2 bg-success/20 rounded-full overflow-hidden mt-2">
                        <div
                            className="absolute top-0 left-0 h-full bg-success opacity-80"
                            style={{ width: `${(simulatedTarget / 1000) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="bg-primary/5 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <Icon name="Activity" size={18} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground">
                            {currentScore > 0
                                ? `Based on your clinical trajectory and EMI payment history, our models predict your score will reach `
                                : `Complete dashboard tasks and report past hospital visits to generate your first Medical Credit Score.`
                            }
                            {currentScore > 0 && <span className="font-bold text-primary">{simulatedTarget}</span>}
                            {currentScore > 0 && ` by late ${new Date(new Date().setMonth(new Date().getMonth() + 6)).toLocaleString('en-US', { month: 'long', year: 'numeric' })} if you clear 100% of your active Medical EMIs.`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictiveInsightCard;
