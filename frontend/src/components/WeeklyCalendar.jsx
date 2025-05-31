import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

const WeeklyCalendar = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Generate an array of dates for the current week
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - currentDay); // Set to Sunday of the current week

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div>
            <Card className='w-min'>
                <CardHeader>
                    <div className='flex justify-between'>
                        <div>
                            <CardTitle>Weekly Calendar</CardTitle>
                            <CardDescription>
                                This is a weekly calendar component.
                            </CardDescription>
                        </div>
                        <Button><Plus /> Add</Button>
                    </div>
                </CardHeader>

                <CardContent className="flex gap-2">
                    {days.map((day, index) => {
                        const date = new Date(weekStart);
                        date.setDate(weekStart.getDate() + index); // Adjust for each day in the week

                        return (
                            <div
                                key={index}
                                className={`hover:bg-accent transition-colors cursor-pointer border select-none border-input p-4 rounded-xl flex flex-col items-center gap-1 
                                    ${index === currentDay ? 'text-green-400 bg-green-800/20' : ''}`}
                            >
                                <div className='text-xs font-semibold'>{day}</div>
                                <div className='text-2xl font-semibold'>{date.getDate()}</div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
};

export default WeeklyCalendar;
