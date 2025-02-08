import React from 'react'
import { Skeleton } from '../ui/skeleton'

const NotesSkeleton = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Skeleton className="h-20"/>
        <Skeleton className="h-20"/>
        <Skeleton className="h-20"/>
        <Skeleton className="h-20"/>
    </div>
  )
}

export default NotesSkeleton