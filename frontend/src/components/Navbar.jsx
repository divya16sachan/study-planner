import React from 'react'

import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import { useAuthStore } from '@/stores/authStore'
import { NavUser } from './NavUser'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const { logout, authUser } = useAuthStore();
    return (
        <nav className='border-b flex items-center justify-between px-4 py-2 fixed w-full  bg-background top-0 left-0 z-50'>
            <div className='flex items-center justify-between max-w-screen-md mx-auto w-full'>
                <h1 className='text-sm font-semibold'>
                    <Link to='/'>Study Planner</Link>
                </h1>
                <div className='flex items-center gap-2'>
                    <Button>
                        <Plus />
                        <span>Add Task</span>
                    </Button>
                    <ModeToggle />
                    {authUser && (
                        <NavUser />
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
