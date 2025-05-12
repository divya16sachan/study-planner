import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Schedule = () => {
  const tasks = [
    {
      time: '9:30',
      endTime: '10:20',
      subject: 'Physics',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam explicabo vero vitae accusantium tempore quaerat quas praesentium consectetur repellendus magnam.'
    },
    {
      time: '10:30',
      endTime: '11:20',
      subject: 'Chemistry',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam explicabo vero vitae accusantium tempore quaerat quas praesentium consectetur repellendus magnam.'
    },
    {
      time: '11:30',
      endTime: '12:20',
      subject: 'Mathematics',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam explicabo vero vitae accusantium tempore quaerat quas praesentium consectetur repellendus magnam.'
    },
    {
      time: '12:30',
      endTime: '1:20',
      subject: 'Biology',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam explicabo vero vitae accusantium tempore quaerat quas praesentium consectetur repellendus magnam.'
    },
    {
      time: '1:30',
      endTime: '2:20',
      subject: 'English',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam explicabo vero vitae accusantium tempore quaerat quas praesentium consectetur repellendus magnam.'
    },
    {
      time: '2:30',
      endTime: '3:20',
      subject: 'History',
      description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam explicabo vero vitae accusantium tempore quaerat quas praesentium consectetur repellendus magnam.'
    }
  ]
  return (
    <div>
      <ul className='space-y-4 my-4 schedule-list'>
        {
          tasks.map((task, index) => (
            <li key={index} className='flex gap-4'>
              <div className='w-[40px]'>
                <div className='font-semibold text-lg'>{task.time}</div>
                <div className='text-sm text-muted-foreground'>{task.endTime}</div>
              </div>

              <div className='size-4 rounded-full bg-foreground border-accent border-4' />

              <Card className='w-[300px]'>
                <CardHeader className='p-3'>
                  <CardTitle>{task.subject}</CardTitle>
                </CardHeader>
                <CardContent className='p-3 pt-0'>
                  <p className='line-clamp-2 text-sm'>{task.description}</p>
                </CardContent>
              </Card>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Schedule;
