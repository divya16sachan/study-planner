import React, { useEffect, useRef, useState } from 'react'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor, ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import ListKeymap from '@tiptap/extension-list-keymap'
import TextAlign from '@tiptap/extension-text-align'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { SlashCommand } from '../SlashCommand'



import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight'

// eslint-disable-next-line
import CodeBlockComponent from '../CodeBlockComponent'

// create a lowlight instance
const lowlight = createLowlight(all)

// you can also register individual languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

import { Button } from '../ui/Button'

import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import TooltipWrapper from "../TooltipWrapper";
import {
    Ellipsis,
    EllipsisVertical,
    Heading,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    HighlighterIcon,
    ImageIcon,
    Loader2,
    Palette,
    Pilcrow,
    TableIcon,
    UploadCloudIcon
} from 'lucide-react'
import { useNoteStore } from '@/stores/useNoteStore'
import { useNavigate, useParams } from 'react-router-dom'
import NoteSkeleton from '../sekeletons/NoteSkeleton'
import FileDropZone from '../FileDropZone'
import SuggestionList from '../SuggestionList'

import {
    COLORS,
    FORMATTING_BUTTONS,
    LIST_BUTTONS,
    LIST_CONTROL_BUTTONS,
    BLOCK_BUTTONS,
    CONTROL_BUTTONS,
    ALIGNMENT_BUTTONS,
    TABLE_BUTTONS,
    TABLE_ROW_CONTROLS,
    TABLE_COLUMN_CONTROLS,
} from './editor.config.jsx'

import TablePopover from './TablePopover'
import ColorPicker from './ColorPicker'


const MenuBar = ({ noteId }) => {
    const { editor } = useCurrentEditor()
    const navigate = useNavigate();

    const { updateContent, isContentUploading } = useNoteStore();
    if (!editor) {
        return null
    }
    const headers = [1, 2, 3, 4, 5, 6];
    const imageTrigger = useRef(null);
    const isEmptyContent = (htmlString) => {
        const contentRegex = /<[^>]*>(\s*[^<]*\S\s*|<img\s+[^>]*>.*?)<\/[^>]*>/;
        return !contentRegex.test(htmlString);
    }
    const handleContentSave = async () => {
        let content = editor.getHTML().replace(/<table/g, '<div class="tableWrapper"><table')
            .replace(/<\/table>/g, '</table></div>')
            .replace(/<pre/g, "<div class='relative pre-wrapper'><pre")
            .replace(/<\/pre>/g, '</pre></div>');

        if (isEmptyContent(content)) content = '';
        await updateContent({
            content,
            noteId: noteId
        });
        navigate(-1);
    }

    return (
        <div className="control-group mb-2 sticky top-0 z-10 bg-background border-b border-input">
            <div className="Button-group flex flex-wrap gap-1">

                {
                    FORMATTING_BUTTONS.map(({ icon, command, tooltip, name }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                size="icon"
                                onClick={() => editor.chain().focus()[command]().run()}
                                disabled={!editor.can().chain().focus()[command]().run()}
                                variant={editor.isActive(name) ? 'secondary' : 'ghost'}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>
                    ))
                }
                {<SuggestionList editor={editor} imageTrigger={imageTrigger} />}
                {
                    BLOCK_BUTTONS.map(({ icon, command, tooltip, name }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                size="icon"
                                onClick={() => editor.chain().focus()[command]().run()}
                                variant={editor.isActive(name) ? 'secondary' : 'ghost'}
                                disabled={name === 'code' && !editor.can().chain().focus()[command]().run()}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>
                    ))
                }

                {
                    LIST_BUTTONS.map(({ icon, command, tooltip, name }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                size="icon"
                                onClick={() => editor.chain().focus()[command]().run()}
                                variant={editor.isActive(name) ? 'secondary' : 'ghost'}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>
                    ))
                }

                {
                    LIST_CONTROL_BUTTONS.map(({ icon, command, tooltip, name }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                    if (editor.can()[command](name[0])) {
                                        editor.chain().focus()[command](name[0]).run();
                                    } else if (editor.can()[command](name[1])) {
                                        editor.chain().focus()[command](name[1]).run();
                                    }
                                }}
                                disabled={!editor.can()[command](name[0]) && !editor.can()[command](name[1])}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>
                    ))
                }


                {
                    CONTROL_BUTTONS.map(({ icon, command, tooltip }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => editor.chain().focus()[command]().run()}
                                disabled={!editor.can().chain().focus()[command]().run()}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>
                    ))
                }

                {
                    ALIGNMENT_BUTTONS.map(({ icon, command, tooltip, name }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                size="icon"
                                onClick={() => editor.chain().focus()[command](name).run()}
                                variant={editor.isActive({ textAlign: name }) ? 'secondary' : 'ghost'}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>

                    ))
                }

                <Select>
                    <SelectTrigger className="w-16">
                        <SelectValue placeholder={
                            editor.isActive('heading', { level: 1 }) ? <Heading1 className='size-5' /> :
                                editor.isActive('heading', { level: 2 }) ? <Heading2 className='size-5' /> :
                                    editor.isActive('heading', { level: 3 }) ? <Heading3 className='size-5' /> :
                                        editor.isActive('heading', { level: 4 }) ? <Heading4 className='size-5' /> :
                                            editor.isActive('heading', { level: 5 }) ? <Heading5 className='size-5' /> :
                                                editor.isActive('heading', { level: 6 }) ? <Heading6 className='size-5' /> :
                                                    editor.isActive('paragraph') ? <Pilcrow className='size-4' /> :
                                                        <Heading className='size-4' />
                        } />
                    </SelectTrigger>
                    <SelectContent className="flex-col">
                        {
                            headers.map((level, index) => (
                                <TooltipWrapper key={index} message={`Heading ${level}`}>
                                    <Button
                                        onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                                        variant={editor.isActive('heading', { level }) ? 'secondary' : 'ghost'}
                                    >
                                        H{level}
                                    </Button>
                                </TooltipWrapper>
                            ))
                        }
                        <Button
                            onClick={() => editor.chain().focus().setParagraph().run()}
                            variant={editor.isActive('paragraph') ? 'secondary' : 'ghost'}
                        >
                            <Pilcrow />
                        </Button>
                    </SelectContent>
                </Select>

                <ColorPicker
                    icon={HighlighterIcon}
                    tooltipMessage="Highlighter"
                    colors={COLORS}
                    activeColor={COLORS.find((color) => editor.isActive('highlight', { color }))}
                    onColorSelect={(color) => editor.chain().focus().setHighlight({ color }).run()}
                    onUnsetColor={() => editor.chain().focus().unsetHighlight().run()}
                    isActive={(color) => editor.isActive('highlight', { color })}
                />

                <ColorPicker
                    icon={Palette}
                    tooltipMessage="Set Color"
                    colors={COLORS}
                    activeColor={COLORS.find((color) => editor.isActive('textStyle', { color }))}
                    onColorSelect={(color) => editor.chain().focus().setColor(color).run()}
                    onUnsetColor={() => editor.chain().focus().unsetColor().run()}
                    isActive={(color) => editor.isActive('textStyle', { color })}
                />

                <div className='border rounded-lg'>
                    <TablePopover
                        editor={editor}
                        controllers={TABLE_BUTTONS}
                        triggerIcon={<TableIcon />}
                    />
                    <TablePopover
                        editor={editor}
                        controllers={TABLE_COLUMN_CONTROLS}
                        triggerIcon={<Ellipsis />}
                    />
                    <TablePopover
                        editor={editor}
                        controllers={TABLE_ROW_CONTROLS}
                        triggerIcon={<EllipsisVertical />}
                    />
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button ref={imageTrigger} variant="outline"><ImageIcon /></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle style={{ display: "none" }}>Add Image</DialogTitle>
                        <FileDropZone editor={editor} />
                    </DialogContent>
                </Dialog>

                <TooltipWrapper message={"Save Content"}>
                    <Button
                        disabled={!noteId || isContentUploading}
                        onClick={handleContentSave}
                    >
                        {
                            isContentUploading ?
                                <Loader2 className='animate-spin' /> :
                                <><UploadCloudIcon />Save</>
                        }
                    </Button>
                </TooltipWrapper>
            </div>
        </div >
    )
}


const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
    }),
    CodeBlockLowlight
        .extend({
            addNodeView() {
                return ReactNodeViewRenderer(CodeBlockComponent)
            },
        })
        .configure({ lowlight }),
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    Underline,
    ListKeymap,
    TaskList,
    TaskItem.configure({
        nested: true,
    }),
    Table.configure({
        resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Placeholder.configure({
        placeholder: "Type / for options",
    }),
    Image,
    SlashCommand,
]


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