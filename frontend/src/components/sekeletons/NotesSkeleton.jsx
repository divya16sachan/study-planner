import React from 'react'
import { Skeleton } from '../ui/skeleton'

const NotesSkeleton = () => {
  let notesLength = localStorage.getItem("notesLength");
  notesLength = notesLength ? JSON.parse(notesLength) : [];
  notesLength = notesLength.reduce((sum, curr) => sum + curr, 0);

  const skeletons = [];
  for (let i = 0; i < notesLength; ++i) {
    skeletons.push(<Skeleton key={i} className="h-28" />);
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {skeletons}
    </div>
  )
}

export default NotesSkeleton