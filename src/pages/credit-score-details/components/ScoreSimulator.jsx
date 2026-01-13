import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ScoreSimulator = ({ currentScore }) => {
  const [simulationType, setSimulationType] = useState('payment');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [newBillAmount, setNewBillAmount] = useState('');
  const [simulatedScore, setSimulatedScore] = useState(null);

  const simulationTypes = [
    { value: 'payment', label: 'Make a Payment' },
    { value: 'newbill', label: 'Add New Bill' },
    { value: 'missedpayment', label: 'Missed Payment' }
  ];

  const calculateSimulation = () => {
    let newScore = currentScore;

    if (simulationType === 'payment' && paymentAmount) {
      const amount = parseFloat(paymentAmount);
      if (amount >= 1000) newScore += 15;
      else if (amount >= 500) newScore += 10;
      else if (amount >= 100) newScore += 5;
    } else if (simulationType === 'newbill' && newBillAmount) {
      const amount = parseFloat(newBillAmount);
      if (amount >= 5000) newScore -= 20;
      else if (amount >= 2000) newScore -= 10;
      else if (amount >= 500) newScore -= 5;
    } else if (simulationType === 'missedpayment') {
      newScore -= 25;
    }

    newScore = Math.max(300, Math.min(850, newScore));
    setSimulatedScore(newScore);
  };

  const resetSimulation = () => {
    setPaymentAmount('');
    setNewBillAmount('');
    setSimulatedScore(null);
  };

  const scoreDifference = simulatedScore ? simulatedScore - currentScore : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon name="Calculator" size={20} color="var(--color-accent)" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
            Score Simulator
          </h3>
          <p className="text-sm md:text-base text-muted-foreground">
            See how actions affect your credit score
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <Select
          label="Simulation Type"
          options={simulationTypes}
          value={simulationType}
          onChange={setSimulationType}
        />

        {simulationType === 'payment' && (
          <Input
            label="Payment Amount"
            type="number"
            placeholder="Enter payment amount"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e?.target?.value)}
          />
        )}

        {simulationType === 'newbill' && (
          <Input
            label="New Bill Amount"
            type="number"
            placeholder="Enter bill amount"
            value={newBillAmount}
            onChange={(e) => setNewBillAmount(e?.target?.value)}
          />
        )}

        <div className="flex gap-3">
          <Button
            variant="default"
            iconName="Play"
            iconPosition="left"
            onClick={calculateSimulation}
            fullWidth
          >
            Simulate
          </Button>
          <Button
            variant="outline"
            iconName="RotateCcw"
            onClick={resetSimulation}
          >
            Reset
          </Button>
        </div>
      </div>
      {simulatedScore !== null && (
        <div className="mt-6 p-4 md:p-6 bg-muted rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground caption mb-1">Current Score</div>
              <div className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                {currentScore}
              </div>
            </div>
            <Icon name="ArrowRight" size={24} className="text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground caption mb-1">Projected Score</div>
              <div className={`text-2xl md:text-3xl font-heading font-bold ${
                scoreDifference > 0 ? 'text-success' : scoreDifference < 0 ? 'text-error' : 'text-foreground'
              }`}>
                {simulatedScore}
              </div>
            </div>
          </div>

          <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
            scoreDifference > 0 ? 'bg-success/10 text-success' : scoreDifference < 0 ? 'bg-error/10 text-error' : 'bg-muted'
          }`}>
            <Icon name={scoreDifference > 0 ? 'TrendingUp' : scoreDifference < 0 ? 'TrendingDown' : 'Minus'} size={20} />
            <span className="text-base md:text-lg font-medium">
              {scoreDifference > 0 ? '+' : ''}{scoreDifference} points
            </span>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground text-center">
            This is an estimated projection based on typical score calculations
          </p>
        </div>
      )}
    </div>
  );
};

export default ScoreSimulator;