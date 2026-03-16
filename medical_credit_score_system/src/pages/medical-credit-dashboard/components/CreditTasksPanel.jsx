import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CreditTasksPanel = ({ onTaskComplete }) => {
    const [tasks, setTasks] = useState([
        {
            id: 'task-upload-records',
            title: 'Upload Health Checkup Report',
            description: 'Upload your latest general health checkup report to maintain an active profile.',
            points: 15,
            type: 'document_upload', // will map to the backend's document upload endpoint mentally
            completed: false,
            icon: 'FileText',
            color: 'var(--color-primary)'
        },
        {
            id: 'task-verify-mobile',
            title: 'Verify Emergency Contact',
            description: 'Add and verify an emergency contact number for safety compliance.',
            points: 5,
            type: 'profile_update',
            completed: false,
            icon: 'Phone',
            color: 'var(--color-secondary)'
        },
        {
            id: 'task-connect-wearable',
            title: 'Connect Fitness Device',
            description: 'Sync your fitness or health tracking device data to your profile.',
            points: 20,
            type: 'device_sync',
            completed: false,
            icon: 'Watch',
            color: 'var(--color-accent)'
        }
    ]);

    const [completingTask, setCompletingTask] = useState(null);

    const handleClaim = async (task) => {
        setCompletingTask(task.id);
        try {
            // We will pretend to open a small modal / file input depending on the task.
            // For this real-time app phase, we'll directly trigger the API that was provided.
            await onTaskComplete({
                type: task.type,
                title: `Completed Task: ${task.title}`,
                description: `Successfully claimed ${task.points} points.`,
                date: new Date().toISOString(),
                taskId: task.id,
                points: task.points
            });

            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: true } : t));
        } catch (error) {
            console.error('Failed to complete task', error);
            alert('Failed to claim points.');
        } finally {
            setCompletingTask(null);
        }
    };

    const activeTasks = tasks.filter(t => !t.completed);

    if (activeTasks.length === 0) {
        return (
            <div className="bg-success/5 border border-success/20 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-success/20 rounded-full flex flex-col items-center justify-center mx-auto mb-3">
                    <Icon name="Check" size={24} className="text-success" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-1">All Caught Up!</h3>
                <p className="text-sm text-muted-foreground">You have completed all available tasks. Check back later for more opportunities to boost your score.</p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                    Claim Credit Points
                </h3>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">{activeTasks.length} Available</span>
            </div>

            <p className="text-sm text-muted-foreground mb-6">Complete these pending tasks to securely increase your medical credit score instantly.</p>

            <div className="space-y-4">
                {activeTasks.map((task) => (
                    <div key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg bg-background hover:border-primary/50 transition-colors gap-4">
                        <div className="flex items-start space-x-4">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${task.color}15` }}
                            >
                                <Icon name={task.icon} size={20} color={task.color} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    {task.title}
                                    <span className="text-xs font-bold text-success bg-success/10 px-1.5 py-0.5 rounded-sm">
                                        +{task.points} pts
                                    </span>
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1 max-w-sm">{task.description}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto shrink-0"
                            loading={completingTask === task.id}
                            onClick={() => handleClaim(task)}
                            disabled={completingTask !== null}
                        >
                            Claim Task
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CreditTasksPanel;
