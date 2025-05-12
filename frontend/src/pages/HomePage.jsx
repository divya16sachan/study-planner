import Schedule from '@/components/Schedule'
import TaskTable from '@/components/TaskTable'
import WeeklyCalendar from '@/components/WeeklyCalendar'
import React from 'react'

const HomePage = () => {
  return (
    <div className='p-4'>
      <TaskTable/>
      <WeeklyCalendar/>
      <Schedule/>
    </div>
  )
}

export default HomePage
