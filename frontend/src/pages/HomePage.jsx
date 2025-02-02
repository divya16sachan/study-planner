import React, { useEffect, useState } from 'react';
import Tiptap from '../components/Tiptap';
import { useNoteStore } from '@/stores/useNoteStore';
import { useAuthStore } from '@/stores/useAuthStore';
import parse from 'html-react-parser';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import hljs from 'highlight.js';

const HomePage = () => {
  const { selectedNote, getNoteContent } = useNoteStore();
  const { authUser } = useAuthStore();
  const [content, setContent] = useState('');
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    // Apply syntax highlighting after content is rendered
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
  }, [content]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedNote) {
        const noteContent = await getNoteContent(selectedNote);
        setContent(noteContent || '');
      }
    };
    fetchData();
  }, [selectedNote, getNoteContent]);

  return (
    <div className="homepage w-full h-full flex">
      <div className='flex-grow overflow-auto'>
        {
          edit ?
            <Tiptap content={content} />
            :
            selectedNote ?
              (
                <div className='tiptap relative'>
                  <Button
                    variant="secondary"
                    className="fixed bottom-2 right-2 font-bold"
                    onClick={() => setEdit(true)}
                  >
                    <Pencil /> Edit
                  </Button>
                  {parse(content)}
                </div>
              ) : (
                <div className="h-full">
                  <h1 className="text-2xl font-semibold flex items-center gap-2">
                    <span>Welcome</span>
                    <span className="text-[#a5b4fc]">{authUser.fullName.split(/\s/)[0]}</span>
                  </h1>
                </div>
              )}
      </div>
    </div>

  );
};

export default HomePage;
