import React, { useEffect, useState } from 'react';
import Tiptap from '../components/Tiptap';
import { useNoteStore } from '@/stores/useNoteStore';
import { useAuthStore } from '@/stores/useAuthStore';
import parse from 'html-react-parser';
import { Button } from '@/components/ui/button';
import { Copy, CopyCheck, Pencil } from 'lucide-react';
import hljs from 'highlight.js';
import { createRoot } from 'react-dom/client';
import { toast } from 'sonner';
import NoteSkeleton from '@/components/sekeletons/NoteSkeleton';

const HomePage = () => {
  const { selectedNote, getNoteContent, isContentLoading } = useNoteStore();
  const { authUser } = useAuthStore();
  const [content, setContent] = useState('');
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    // Apply syntax highlighting after content is rendered
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });

    // Prevent the checkbox modification outside tiptap editor
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.setAttribute('disabled', true);
      checkbox.style.cursor = "default"
    })

    // Add header with copy button to each pre tag
    document.querySelectorAll('pre').forEach((pre) => {
      if (!pre.querySelector('.pre-header')) {
        const codeElement = pre.querySelector('code');
        const languageClass = Array.from(codeElement.classList).find(cls => cls.startsWith('language-'));
        const language = languageClass ? languageClass.replace('language-', '') : 'unknown';

        const header = document.createElement('header');
        header.className = 'pre-header absolute top-0 left-0 w-full bg-background rounded-t-md flex items-center justify-between p-2 border border-b-input';
        header.innerHTML = `<span>${language}</span>`;
        pre.insertBefore(header, pre.firstChild);

        const buttonContainer = document.createElement('div');
        header.appendChild(buttonContainer);

        const CopyButton = () => {
          const [copied, setCopied] = useState(false);

          const handleCopy = async () => {
            const codeContent = codeElement.innerText;
            await navigator.clipboard.writeText(codeContent);
            toast.success('Content copied to clipboard!');
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          };

          return (
            <Button variant="ghost" size="icon" onClick={handleCopy} disabled={copied}>
              {copied ? <CopyCheck /> : <Copy />}
            </Button>
          );
        };

        const root = createRoot(buttonContainer);
        root.render(<CopyButton />);
      }
    });

  }, [content]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedNote) {
        let noteContent = await getNoteContent(selectedNote);
        // WRAPPING TABLES AND CODEBLOCK WITH WRAPPER
        noteContent = noteContent.replace(/<table/g, '<div class="tableWrapper"><table')
          .replace(/<\/table>/g, '</table></div>')
          .replace(/<pre/g, "<div class='relative pre-wrapper'><pre")
          .replace(/<\/pre>/g, '</pre></div>')


        setContent(noteContent || '');
      }
    };
    fetchData();
  }, [selectedNote, getNoteContent]);

  if (isContentLoading) {
    return <NoteSkeleton />
  }
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
                  className="fixed z-10 shadow-md bottom-2 right-4 font-bold"
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
                <p className='max-w-[500px] my-4'>The shocking impact of matrix was precisely the valid possibility that what we believe to be reality was but our perception</p>
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
