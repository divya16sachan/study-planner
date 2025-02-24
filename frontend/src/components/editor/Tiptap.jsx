import React, { useEffect, useState } from 'react'
import { extensions } from './config/extensions.config'
import { EditorProvider } from '@tiptap/react'
import { useParams } from 'react-router-dom'
import { useNoteStore } from '@/stores/useNoteStore'
import NoteSkeleton from '../sekeletons/NoteSkeleton'
import { MenuBar } from './MenuBar';

const Tiptap = () => {
    const { getNoteContent, isContentLoading } = useNoteStore();
    const { id: noteId } = useParams();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (noteId) {
                const noteContent = await getNoteContent(noteId);
                if(noteContent === null){
                    setNotFound(true);
                }
                setContent(noteContent);
                setLoading(false);
            }
        };
        fetchData();
    }, [noteId, getNoteContent]);

    if (notFound) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <img src='/404-not-found.svg' className='p-4 rounded-lg max-w-[500px]'></img>
            </div>
        )
    }

    if (isContentLoading || loading) {
        return <NoteSkeleton />;
    }
    return (
        <EditorProvider
            className="h-full opacity-0"
            slotBefore={<MenuBar noteId={noteId} />}
            extensions={extensions}
            content={content}
        />
    );
};
export default Tiptap;