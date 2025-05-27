import Schedule from '@/components/Schedule'
import WeeklyCalendar from '@/components/WeeklyCalendar'
import React from 'react'

const WeeklyTaskPage = () => {
    return (
        <div className='max-w-screen-lg mx-auto w-full p-4 mt-16'>
            <WeeklyCalendar />
            <Schedule />
        </div>
    )
}

export default WeeklyTaskPage
