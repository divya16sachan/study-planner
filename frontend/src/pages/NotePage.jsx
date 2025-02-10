import { Button } from '@/components/ui/button';
import { useNoteStore } from '@/stores/useNoteStore';
import { Copy, CopyCheck, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import parse from 'html-react-parser';
import NoteSkeleton from '@/components/sekeletons/NoteSkeleton';
import { useNavigate } from 'react-router-dom';
import hljs from 'highlight.js';
import { createRoot } from 'react-dom/client';
import { toast } from 'sonner';


const NotePage = () => {
    const { id } = useParams();
    const { getNoteContent, isContentLoading } = useNoteStore();
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                let noteContent = await getNoteContent(id);
                setContent(noteContent || '');
            }
        };

        fetchData();
    }, [id, getNoteContent]);

    useEffect(() => {
        // Apply syntax highlighting after content is rendered
        if (content) {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });

            // Add header with copy button to each pre tag
            document.querySelectorAll('pre').forEach((pre) => {
                if (!pre.querySelector('.pre-header')) {
                    const codeElement = pre.querySelector('code');
                    const languageClass = Array.from(codeElement.classList).find(cls => cls.startsWith('language-'));
                    const language = languageClass ? languageClass.replace('language-', '') : 'unknown';

                    const header = document.createElement('header');
                    header.className = 'pre-header absolute top-0 left-0 w-full bg-[#09090b] rounded-t-md flex items-center justify-between p-2 border border-b-input';
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
        }
    }, [content]);

    if (isContentLoading) {
        return <NoteSkeleton />
    }

    if (content === '') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <Button
                    onClick={() => navigate(`/note/${id}/editor`)}
                    variant="secondary"
                    size="lg"
                    className="shadow-md bottom-2 right-4 font-bold"
                >
                    <Pencil /> Write
                </Button>
                <img
                    className='size-[200px] mx-auto mt-4 grayscale-[100] opacity-50'
                    src="/empty-note-state.svg"
                    alt=""
                />
                <div>No content</div>
            </div>
        )
    }

    return (

        <div className={`tiptap ${!content.trim() ? 'empty' : ''}`}>
            <Button
                onClick={() => navigate(`editor`)}
                variant="secondary"
                className="fixed right-2  bottom-2 shadow-md z-10 font-bold"
            >
                <Pencil /> Edit
            </Button>
            {parse(content)}
        </div>

    )
}

export default NotePage