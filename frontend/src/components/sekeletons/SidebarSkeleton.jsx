import React from 'react'
import { Skeleton } from '../ui/skeleton'

const SidebarSkeleton = () => {
    const notesLength = JSON.parse(localStorage.getItem('notesLength'));
    return (
        <div className='h-full pt-8 w-full border  p-2'>
            {
                notesLength.map((length, index) => (
                    <div key={index} className='mb-8'>
                        <Skeleton className={'w-full h-7 mb-3'} />
                        <div className='space-y-2 mx-4'>
                            {
                                Array(length).fill(null).map((_, index) => (
                                    <div key={index} className='flex gap-2'>
                                        <Skeleton className={'size-5 flex-shrink-0'} />
                                        <Skeleton className={'w-full h-5'} />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))
            }

        </div>
    )
}

export default SidebarSkeleton