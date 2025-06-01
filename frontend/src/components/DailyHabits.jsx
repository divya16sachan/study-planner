import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Trash2, Flame, Trophy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import useHabitStore from '@/stores/habitStore';
import CircularProgress from './CircularProgress';

const DailyHabits = () => {
    const { habits, addHabit, toggleHabit, updateHabit, deleteHabit } = useHabitStore();
    const [newHabitText, setNewHabitText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    // Calculate progress
    const completedCount = habits.filter(habit => habit.completed).length;
    // const progress = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
    const progress = habits.length > 0 ? ((completedCount / habits.length) * 100).toFixed(1) : 0;

    const handleAddHabit = (e) => {
        e.preventDefault();
        if (newHabitText.trim()) {
            addHabit(newHabitText);
            setNewHabitText('');
        }
    };

    const handleStartEdit = (habit) => {
        setEditingId(habit.id);
        setEditText(habit.text);
    };

    const handleSaveEdit = (id) => {
        if (editText.trim()) {
            updateHabit(id, editText);
        }
        setEditingId(null);
    };

    // Streak indicator component
    const StreakIndicator = ({ streak, bestStreak }) => (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="flex items-center gap-1 text-xs">
                    {streak > 0 ? (
                        <span className="flex items-center text-orange-500">
                            <Flame className="h-3 w-3" /> {streak}d
                        </span>
                    ) : null}
                    {bestStreak > 0 && (
                        <span className="flex items-center text-yellow-500">
                            <Trophy className="h-3 w-3 ml-1" /> {bestStreak}d
                        </span>
                    )}
                </span>
            </TooltipTrigger>
            <TooltipContent>
                {streak > 0 ? `Current streak: ${streak} days` : 'No current streak'}
                {bestStreak > 0 && ` | Best streak: ${bestStreak} days`}
            </TooltipContent>
        </Tooltip>
    );

    return (
        <TooltipProvider>
            <div className="space-y-8 w-full rounded-lg bg-accent/30 border max-w-md p-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Daily Habits</h2>
                            <div className="text-sm text-muted-foreground">
                                {completedCount}/{habits.length} completed
                            </div>
                        </div>

                        <CircularProgress value={progress} size={60} strokeWidth={6} textSize='xs' />
                    </div>
                </div>

                <div className="space-y-2">
                    {habits.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No habits yet. Add your first habit to start tracking!
                        </div>
                    ) : (
                        habits.map((habit) => (
                            <div
                                key={habit.id}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 group"
                            >
                                <Checkbox
                                    id={`habit-${habit.id}`}
                                    checked={habit.completed}
                                    onCheckedChange={() => toggleHabit(habit.id)}
                                    className="h-5 w-5 rounded-full"
                                />

                                {editingId === habit.id ? (
                                    <Input
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        onBlur={() => handleSaveEdit(habit.id)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(habit.id)}
                                        autoFocus
                                        className="h-8 flex-1"
                                    />
                                ) : (
                                    <div className="flex-1 flex items-center justify-between min-w-0">
                                        <label
                                            htmlFor={`habit-${habit.id}`}
                                            className={`text-sm truncate ${habit.completed ? 'line-through text-muted-foreground' : ''}`}
                                            onClick={() => handleStartEdit(habit)}
                                        >
                                            {habit.text}
                                        </label>
                                        <StreakIndicator streak={habit.streak} bestStreak={habit.bestStreak} />
                                    </div>
                                )}

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteHabit(habit.id);
                                    }}
                                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={handleAddHabit} className="flex items-center gap-2 pt-2">
                    <Input
                        type="text"
                        placeholder="New habit (e.g. 'Drink water')"
                        value={newHabitText}
                        onChange={(e) => setNewHabitText(e.target.value)}
                        className="h-9 bg-input/30"
                    />
                    <Button
                        type="submit"
                        variant="secondary"
                        disabled={!newHabitText.trim()}
                    >
                        Add
                    </Button>
                </form>
            </div>
        </TooltipProvider>
    );
};

export default DailyHabits;