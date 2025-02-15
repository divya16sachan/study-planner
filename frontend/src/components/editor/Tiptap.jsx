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

    useEffect(() => {
        const fetchData = async () => {
            if (noteId) {
                const noteContent = await getNoteContent(noteId);
                setContent(noteContent);
                setLoading(false);
            }
        };
        fetchData();
    }, [noteId, getNoteContent]);


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