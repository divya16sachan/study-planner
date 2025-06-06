import FlipTimer from '@/components/FlipTimer'
import Pomodoro from '@/components/Pomodoro/Pomodoro'
import SpotifyWidget from '@/components/SpotifyWidget'
import { useAuthStore } from '@/stores/authStore'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { AlarmClock, Calendar } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import WeeklyTaskPage from '../pages/WeeklyTaskPage.jsx'
import TodoList from '@/components/TodoList.jsx'
import NotesList from '@/components/NotesList.jsx'
import DailyHabits from '@/components/DailyHabits.jsx'
import { Separator } from '@radix-ui/react-separator'


function Card({ title, image, path }) {
  return (
    <Link to={path} className='flex-1'>
      <div className='relative rounded-lg aspect-video overflow-hidden'>
        <img src={image} alt="" />
        <div
          className='absolute  sm:text-xl  inset-0 capitalize cursor-pointer flex items-center justify-center font-bold bg-black/30 hover:bg-black/40 transition-colors text-white'
        >
          {title}
        </div>
      </div>
      <div className='text-muted-foreground text-sm my-1 flex  items-center gap-2'>
        <Calendar className='size-4' />
        <p>Lorem, ipsum</p>
      </div>
    </Link>
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

const data = [
  { title: "Daily", path: '/weekly-task', image: "./cover7.jpg" },
  { title: "Weekly", path: '/weekly-task', image: "./cover8.jpg" },
  { title: "Monthly", path: '/weekly-task', image: "./cover3.jpg" },
]

const randomImage = images[Math.floor(Math.random() * images.length)];

const HomePage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className='p-4 mt-16 max-w-screen-lg mx-auto w-full'>
      <div className='relative mb-16'>
        <div className='rounded-lg overflow-hidden h-48'>
          <img
            onError={(e) => { e.target.src = './placeholder.svg'; }}
            className="w-full h-full object-cover"
            src={images[5]}
            alt="Cover Photo"
          />
        </div>
        <div className='size-20 absolute rounded-full overflow-hidden bottom-0 left-4 translate-y-1/2'>
          <Avatar className="h-full w-full">
            <AvatarImage
              className="w-full h-full object-cover"
              src={authUser.picture}
              alt={authUser.name}
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="bg-transparent">
              <img src="./avatar.png" alt="" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div>
        <div className='my-4'>
          <h2 className='font-bold text-xl'>Life Planner</h2>
          <p className='border-l-2 text-sm text-muted-foreground pl-2 '>All your throughs in one private place.</p>
        </div>
        <div className='flex gap-4 scrollbar-hide'>
          {
            data.map(({ title, image, path }, index) => (
              <Card key={index} title={title} path={path} image={image} />
            ))
          }
        </div>
      </div>

      <Separator className='border-b my-14' />

      <div className="flex gap-6 flex-col md:flex-row">
        <WeeklyTaskPage className='w-full' />
        <div className='w-full flex gap-6 flex-col sm:flex-row items-start md:flex-col'>
          <TodoList />
          <DailyHabits />
        </div>
      </div>





      <Separator className='border-b my-14' />
      <NotesList />
      <Separator className='border-b my-14' />

      <div>
        <h2 className="text-2xl flex items-center gap-2 font-bold">
          <span>Focus</span>
          <AlarmClock className='size-6' />
        </h2>
        <div className='mt-4 grid gap-4
        sm:grid-cols-[auto_1fr]
        '>
          <Pomodoro className={"min-w-96"} />
          <div className='flex bg-accent/30 rounded-xl items-center justify-center flex-shrink-0 min-w-40 p-4'>
            <FlipTimer />
          </div>

          <SpotifyWidget className='sm:col-span-2' playlistId={"37i9dQZF1E4AfEUiirXPyP"} />
        </div>
      </div>
    </div>
  )
}

export default HomePage
