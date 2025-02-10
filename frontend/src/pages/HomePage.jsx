import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Bold, ChevronRight, Code2, EllipsisVertical, Hash, ListChecksIcon, Plus, Table } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';
import { Link } from 'react-router-dom';
import { formatTime, formatDate } from '@/lib/utils.js';
import { Button } from '@/components/ui/button';
import NotesSkeleton from '@/components/sekeletons/NotesSkeleton';
import { useNoteStore } from '@/stores/useNoteStore';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import NotesOption from '@/components/NotesOption';
import { Badge } from '@/components/ui/badge';
import FileDropZone from '@/components/FileDropZone';

// Feature card data
const featureCards = [
  {
    title: 'Formatting',
    description: 'Enhance the presentation of your text using various formatting options to create clear and structured documents.',
    icon: <Bold />
  },
  {
    title: 'Markdown Shortcuts',
    description: 'Quickly apply formatting to your text with Markdown shortcuts, streamlining the editing process.',
    icon: <Hash />
  },
  {
    title: 'Tables',
    description: 'Create and customize tables to organize data efficiently and present information in a structured format.',
    icon: <Table />
  },
  {
    title: 'Syntax Highlighting',
    description: 'Highlight your code with syntax highlighting, making it easier to read and debug.',
    icon: <Code2 />
  },
  {
    title: 'Tasks',
    description: 'Keep track of your tasks effectively using the built-in task management features.',
    icon: <ListChecksIcon />
  },
];

const FeatureCard = ({ title, description, icon }) => (
  <div className='flex gap-2 items-start p-4 border rounded-lg'>
    <Button className="size-8" variant="secondary" disabled>
      {icon}
    </Button>
    <div className='overflow-hidden w-full'>
      <strong>{title}</strong>
      <p className='line-clamp-2 text-sm text-muted-foreground'>{description}</p>
    </div>
  </div>
);

const NoteCard = ({ note, collectionName }) => (

  <div className='flex gap-2 items-start p-4 border rounded-lg'>
    {/* <Button variant="secondary" disabled className="size-8"><Hash /></Button> */}
    <div className='overflow-hidden w-full'>
      <div className='flex justify-between items-start'>
        <Link
          to={`/note/${note._id}`}
          className='mb-4 w-full text-blue-800 dark:text-[#a8abff] transition-colors group'
        >
          <strong className='truncate block w-full group-hover:underline'>{note.name}</strong>
          <Badge variant="secondary" className="hover:bg-secondary text-xs font-normal">{collectionName}</Badge>
        </Link>


        <NotesOption
          trigger={<EllipsisVertical />}
          note={note}
        />
      </div>
      <div className='flex gap-2 items-center justify-between'>
        <p className='text-sm text-muted-foreground'>{formatDate(note.createdAt)}</p>
        <p className='text-sm text-muted-foreground'>{formatTime(note.createdAt)}</p>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className='mx-auto mb-12 w-[200px] space-y-4 text-center'>
    <img className='grayscale-[100] opacity-50' src="/empty-note-state.svg" alt="Empty state" />
    <p className="w-52 text-muted-foreground">
      No notes yet? Start capturing your ideas now.
    </p>
    <Button size="lg"><Plus /> Add Note</Button>
  </div>
);

// Main component
const HomePage = () => {
  const { authUser } = useAuthStore();
  const { collections } = useNoteStore();

  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await axiosInstance.get('/note');
      setNotes(res.data.notes);
    } catch (error) {
      console.error('Error fetching notes', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchNotes();
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [collections]);

  return (
    <div className='p-4 h-full overflow-y-auto'>
      <div className='space-y-8 max-w-screen-lg mx-auto'>
        <FileDropZone />
        <div className='mb-8 text-2xl font-bold'>
          <span>Welcome </span>
          <span>{authUser.fullName.trim().split(/\s+/)[0]}</span>
        </div>
        {
          isLoading ? <NotesSkeleton /> :
            notes.length === 0 ? (
              <>
                <EmptyState />
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {featureCards.map(({ icon, title, description }, index) => (
                    <FeatureCard key={index} icon={icon} title={title} description={description} />
                  ))}
                </div>
              </>
            ) :
              (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {notes.map((note, index) => (
                    <NoteCard key={index} note={note}
                      collectionName={collections.find(collection => collection._id === note.collectionId)?.name}
                    />
                  ))}
                </div>
              )}
      </div>
    </div>
  );
};

export default HomePage;
