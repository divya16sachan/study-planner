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
      hljs.highlightElement (block);
    });

    // Prevent the checkbox modification outside tiptap editor
    document.querySelectorAll('input[type="checkbox').forEach(checkbox => {
      checkbox.setAttribute('disabled', true);
      checkbox.style.cursor = "default"
    })
  }, [content]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedNote) {
        let noteContent = await getNoteContent(selectedNote);
        noteContent = noteContent.replace(/<table/g, '<div class="tableWrapper"><table').replace(/<\/table>/g, '</table></div>');
        console.log(noteContent);
        setContent(noteContent || '');
      }
    };
    fetchData();
  }, [selectedNote, getNoteContent]);

  return (
    <div className='homepage flex-grow overflow-auto'>
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
              <div className="h-full p-4 max-w-screen-md mx-auto">
                <strong className="text-xl mb-8 font-semibold flex items-center gap-2">
                  <span>Welcome</span>
                  <span className="text-[#a5b4fc]">{authUser.fullName.split(/\s/)[0]}</span>
                </strong>
                <strong className='text-2xl mb-2'>What are you up to?</strong>
                <p className='max-w-[500px] my-4'>The shocking impoact of matrix was precisely the valid possibility that what we believe to be reality was but our perception</p>
                <div className='w-full flex flex-col items-center text-center gap-4'>
                  <img className='opacity grayscale-[100] opacity-30 w-56 object-contain mt-20' src="./empty-note-state.svg" alt="" />
                  <p className='w-80 text-muted-foreground my-6'>You have not selected any note yet!</p>
                </div>
              </div>
            )}
    </div>
  );
};

export default HomePage;
