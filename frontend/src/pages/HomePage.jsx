import FlipTimer from '@/components/FlipTimer'
import Schedule from '@/components/Schedule'
import TaskTable from '@/components/TaskTable'
import WeeklyCalendar from '@/components/WeeklyCalendar'
import { Calendar } from 'lucide-react'
import React from 'react'


function Card({ title, image }) {
  return (
    <div className='flex-1'>
      <div className='relative rounded-lg aspect-video overflow-hidden'>
        <img src={image} alt="" />
        <div className='absolute  inset-0 capitalize cursor-pointer flex items-center justify-center font-bold text-xl bg-black/40 hover:bg-black/30 transition-colors text-white'>{title}</div>
      </div>
      <div className='text-muted-foreground text-sm my-1 flex  items-center gap-2'>
        <Calendar className='size-4'/>
        <p>Lorem, ipsum</p>
      </div>
    </div>
  )
}

const images = [
  "./cover1.jpg",
  "./cover2.jpg",
  "./cover3.jpg",
  "./cover4.jpg",
  "./cover5.jpg",
  "./cover6.jpg",
  "./cover7.jpg",
];

const data =  [
  {title: "Daily", image: "./cover7.jpg"},
  {title: "Weekly", image: "./cover2.jpg"},
  {title: "Monthly", image: "./cover3.jpg"},
]

const randomImage = images[Math.floor(Math.random() * images.length)];

const HomePage = () => {

  return (
    <div className='p-4 mt-16 max-w-screen-lg mx-auto w-full'>
      <div className='rounded-lg overflow-hidden h-48'>
        <img className='w-full h-full object-cover'
        src={images[5]} alt="hello" />
      </div>
      <div>
        <div className='my-4'>
          <h2 className='font-bold text-xl'>Life Planner</h2>
          <p className='border-l-2 text-sm text-muted-foreground pl-2 '>All your throughs in one private place.</p>
        </div>
        <div className='flex gap-4 scrollbar-hide'>
          {
            data.map(({title, image}, index) => (
              <Card key={index} title={title} image={image} />
            ))
          }
        </div>
      </div>
      <div className='flex gap-4 my-4'>
        {/* <div className='w-[200px]'><FlipTimer /></div> */}
        <div></div>
      </div>
      <TaskTable />
      <WeeklyCalendar />
      <Schedule />
    </div>
  )
}

export default HomePage
