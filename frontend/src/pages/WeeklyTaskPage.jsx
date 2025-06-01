import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import useRoutineStore from '@/stores/routineStore';

const WeeklyTaskPage = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  // Get data and actions from Zustand store
  const { weeklyRoutines, addRoutine, updateRoutine, deleteRoutine } = useRoutineStore();

  // Form state
  const [formData, setFormData] = useState({
    time: '',
    endTime: '',
    subject: '',
    description: '',
  });

  // Generate an array of dates for the current week
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - currentDay);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDayClick = (index) => {
    setSelectedDay(index);
  };

  const handleAddClick = () => {
    setFormData({
      time: '',
      endTime: '',
      subject: '',
      description: '',
    });
    setEditingRoutine(null);
    setEditIndex(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (routine, index) => {
    setFormData({ ...routine });
    setEditingRoutine(routine);
    setEditIndex(index);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateTime = (start, end) => {
    if (!start || !end) return false;
    return start < end;
  };

  const checkTimeOverlap = (day, newStart, newEnd, excludeIndex = null) => {
    return weeklyRoutines[day].some((routine, index) => {
      if (excludeIndex !== null && index === excludeIndex) return false;
      return (
        (newStart >= routine.time && newStart < routine.endTime) ||
        (newEnd > routine.time && newEnd <= routine.endTime) ||
        (newStart <= routine.time && newEnd >= routine.endTime)
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateTime(formData.time, formData.endTime)) {
      alert('Please enter valid start and end times');
      return;
    }

    const selectedDayName = days[selectedDay];

    if (checkTimeOverlap(selectedDayName, formData.time, formData.endTime, editIndex)) {
      alert('This time slot overlaps with an existing routine');
      return;
    }

    if (editingRoutine && editIndex !== null) {
      // Update existing routine
      updateRoutine(selectedDayName, editIndex, formData);
    } else {
      // Add new routine
      addRoutine(selectedDayName, formData);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (index) => {
    const selectedDayName = days[selectedDay];
    deleteRoutine(selectedDayName, index);
    setIsDialogOpen(false);
  };

  const selectedDayName = days[selectedDay];
  const dayRoutines = weeklyRoutines[selectedDayName] || [];

  return (
    <div className="w-min">
      <Card className='w-min mb-4 bg-accent/30'>
        <CardHeader>
          <div className='flex justify-between'>
            <div>
              <CardTitle>Weekly Calendar</CardTitle>
              <CardDescription>
                Select a day to view or edit routines
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddClick}><Plus /> Add</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingRoutine ? 'Edit Routine' : 'Add New Routine'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    {editingRoutine && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          handleDelete(editIndex);
                          setIsDialogOpen(false);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                    <Button type="submit">
                      {editingRoutine ? 'Update' : 'Add'} Routine
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="flex gap-2">
          {days.map((day, index) => {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + index);

            return (
              <div
                key={index}
                onClick={() => handleDayClick(index)}
                className={`hover:bg-accent/30 w-14  transition-colors cursor-pointer border select-none border-input p-4 rounded-xl flex flex-col items-center gap-1 
                  ${
                    index === currentDay ?
                     'bg-primary text-primary-foreground hover:bg-primary/75'
                    : index === selectedDay ?
                     'bg-secondary text-secondary-foreground hover:bg-secondary/75'
                    : ''
                  }`
                }
              >
                <div className='text-xs font-semibold'>{day}</div>
                <div className='text-2xl font-semibold'>{date.getDate()}</div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div>
        {dayRoutines.length > 0 ? (
          <ul className='space-y-4 my-4 schedule-list'>
            {dayRoutines
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((task, index) => (
                <li key={index} className='flex gap-4'>
                  <div className='w-[60px]'>
                    <div className='font-semibold text-lg'>{task.time}</div>
                    <div className='text-sm text-muted-foreground'>{task.endTime}</div>
                  </div>

                  <div className='size-4 aspect-square rounded-full bg-foreground border-accent border-4' />

                  <Card
                    className='w-full bg-accent/30 cursor-pointer hover:bg-accent transition-colors'
                    onClick={() => handleEditClick(task, index)}
                  >
                    <CardHeader className='p-3'>
                      <CardTitle>{task.subject}</CardTitle>
                    </CardHeader>
                    <CardContent className='p-3 pt-0'>
                      <p className='line-clamp-2 text-muted-foreground text-sm'>{task.description}</p>
                    </CardContent>
                  </Card>
                </li>
              ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold">You seem free today! 😊</h3>
            <p className="text-muted-foreground">Click the "Add" button to create a new routine</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyTaskPage;