import React from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { ModeToggle } from './mode-toggle'

const Navbar = () => {
    return (
        <nav className='border-b flex items-center justify-between px-4 py-2 fixed w-full  bg-background top-0 left-0 z-50'>
            <Avatar>
                <AvatarImage src="https//avatars.githubusercontent.com/u/141806471?v=4" alt="@divyasachan" />
                <AvatarFallback>DS</AvatarFallback>
            </Avatar>
            <div className='flex items-center gap-2'>
                <Button>
                    <Plus />
                    <span>Add Task</span>
                </Button>
                <ModeToggle/>
            </div>
        </nav>
    )
}

export default Navbar
