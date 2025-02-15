import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import ListKeymap from '@tiptap/extension-list-keymap';
import TextAlign from '@tiptap/extension-text-align';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { SlashCommand } from '@/components/SlashCommand';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import { all } from 'lowlight';
import CodeBlockComponent from '@/components/CodeBlockComponent';
import { ReactNodeViewRenderer } from '@tiptap/react';

const lowlight = createLowlight(all);

export const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
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
];