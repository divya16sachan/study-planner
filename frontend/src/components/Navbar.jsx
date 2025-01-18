import React from 'react'
import { ModeToggle } from "./mode-toggle.jsx";
import { Button } from './ui/button.jsx';
import { Link } from "react-router-dom";
import { Github } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"



const Navbar = () => {
  return (
    <header className='bg-background fixed top-0 left-0 w-full border-b'>
      <div className="container h-14 m-auto flex justify-between items-center">
        <div className='flex gap-6'>
          <div className='flex gap-2 font-bold'>
            <Link to='/'>NoteHub</Link>
          </div>
          <nav className='flex gap-6'>
            <Link to='/'>Settings</Link>
            <Link to='/'>Settings</Link>
            <Link to='/'>Settings</Link>
            <Link to='/'>Settings</Link>
            <Link to='/Settings'>Settings</Link>
          </nav>
        </div>
        <div className='flex gap-2 items-center'>
          <Button variant="outline" size="icon">
            <a href="https://github.com/abhijeetSinghRajput/">
              <Github />
            </a>
          </Button>
          <ModeToggle />
          <Link to='/profile'>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar