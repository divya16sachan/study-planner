import React from 'react'
import { Skeleton } from '../ui/skeleton'

const SidebarSkeleton = () => {
    return (
        <div className='h-full w-full border border-white p-2'>
            {
                Array(4).fill(null).map((e, index) => (
                    <div key={index} className='mb-8'>
                        <Skeleton className={'w-full h-7 mb-3'} />
                        <div className='space-y-2 mx-4'>
                            {
                                Array(3).fill(null).map((e, index) => (
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