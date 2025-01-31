import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import ListKeymap from '@tiptap/extension-list-keymap'
import TextAlign from '@tiptap/extension-text-align'
import React, { useState } from 'react'


import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight'

// eslint-disable-next-line
import CodeBlockComponent from './CodeBlockComponent'

// create a lowlight instance
const lowlight = createLowlight(all)

// you can also register individual languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

import { Button } from './ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import TooltipWrapper from "./TooltipWrapper";
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    CodeSquare,
    Eraser,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    HighlighterIcon,
    Indent,
    Italic,
    List,
    ListOrdered,
    Outdent,
    Palette,
    Pilcrow,
    Quote,
    Redo,
    Strikethrough,
    UnderlineIcon,
    Undo
} from 'lucide-react'

const formatingGroup = [
    {
        name: 'bold',
        icon: <Bold />,
        command: 'toggleBold',
        tooltip: 'Ctrl + B',
    },
    {
        name: 'italic',
        icon: <Italic />,
        command: 'toggleItalic',
        tooltip: 'Ctrl + I',
    },
    {
        name: 'underline',
        icon: <UnderlineIcon />,
        command: 'toggleUnderline',
        tooltip: 'Ctrl + U',
    },
    {
        name: 'strike',
        icon: < Strikethrough />,
        command: 'toggleStrike',
        tooltip: 'Ctrl + Shift + S',
    },
]

const listGroup = [
    {
        name: 'orderedList',
        icon: <ListOrdered />,
        command: 'toggleOrderedList',
        tooltip: "Ctrl + Shift + 7",
    },
    {
        name: 'bulletList',
        icon: <List />,
        command: 'toggleBulletList',
        tooltip: "Ctrl + Shift + 8",
    },
]

const listController = [
    {
        name: 'listItem',
        icon: <Outdent />,
        command: 'liftListItem',
        tooltip: "Lift list item",
    },
    {
        name: 'listItem',
        icon: <Indent />,
        command: 'sinkListItem',
        tooltip: "Sink list item",
    },
];

const blockGroup = [
    {
        name: 'codeBlock',
        icon: <CodeSquare />,
        command: 'toggleCodeBlock',
        tooltip: 'Code Block"',
    },
    {
        name: 'code',
        icon: <Code />,
        command: 'toggleCode',
        tooltip: 'Code',
    },
    {
        name: 'blockquote',
        icon: <Quote />,
        command: 'toggleBlockquote',
        tooltip: 'blockquote',
    },
];

const controller = [
    {
        icon: <Undo />,
        command: 'undo',
        tooltip: 'Ctrl + Z',
    },
    {
        icon: <Redo />,
        command: 'redo',
        tooltip: 'Ctrl + Y',
    },
]
const alignments = [
    {
        name: 'left',
        icon: <AlignLeft />,
        command: 'setTextAlign',
        tooltip: 'Ctrl + Shift + L',
    },
    {
        name: 'center',
        icon: <AlignCenter />,
        command: 'setTextAlign',
        tooltip: 'Ctrl + Shift + E',
    },
    {
        name: 'right',
        icon: <AlignRight />,
        command: 'setTextAlign',
        tooltip: 'Ctrl + Shift + R',
    },
    {
        name: 'justify',
        icon: <AlignJustify />,
        command: 'setTextAlign',
        tooltip: 'Ctrl + Shift + J',
    },
]
const colors = ['#fb7185', '#fdba74', '#d9f99d', '#a7f3d0', '#a5f3fc', '#a5b4fc'];

const MenuBar = () => {
    const { editor } = useCurrentEditor()

    if (!editor) {
        return null
    }
    const headers = [1, 2, 3, 4, 5, 6];

    return (
        <div className="control-group mb-2 sticky top-0 z-10 bg-background border-b border-input">
            <div className="Button-group flex flex-wrap gap-1">

                {
                    formatingGroup.map(({ icon, command, tooltip, name }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                onClick={() => editor.chain().focus()[command]().run()}
                                disabled={!editor.can().chain().focus()[command]().run()}
                                variant={editor.isActive(name) ? '' : 'ghost'}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>
                    ))
                }
                {
                    blockGroup.map(({ icon, command, tooltip, name }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                onClick={() => editor.chain().focus()[command]().run()}
                                variant={editor.isActive(name) ? '' : 'ghost'}
                                disabled={name === 'code' && !editor.can().chain().focus()[command]().run()}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>
                    ))
                }

                {
                    listGroup.map(({ icon, command, tooltip, name }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                onClick={() => editor.chain().focus()[command]().run()}
                                variant={editor.isActive(name) ? '' : 'ghost'}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>
                    ))

                }
                {
                    listController.map(({ icon, command, tooltip, name }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                variant="ghost"
                                onClick={() => editor.chain().focus()[command](name).run()}
                                disabled={!editor.can()[command](name)}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>
                    ))
                }

                {
                    controller.map(({ icon, command, tooltip }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
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
                    alignments.map(({ icon, command, tooltip, name }, index) => (
                        <TooltipWrapper message={tooltip}>
                            <Button
                                onClick={() => editor.chain().focus()[command](name).run()}
                                variant={editor.isActive({ textAlign: name }) ? '' : 'ghost'}
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
                            'Heading...'
                        } />
                    </SelectTrigger>
                    <SelectContent className="flex-col">
                        {
                            headers.map((level, index) => (
                                <TooltipWrapper key={index} message={`Heading ${level}`}>
                                    <Button
                                        onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                                        variant={editor.isActive('heading', { level }) ? '' : 'ghost'}
                                    >
                                        H{level}
                                    </Button>
                                </TooltipWrapper>
                            ))
                        }
                        <Button
                            onClick={() => editor.chain().focus().setParagraph().run()}
                            variant={editor.isActive('paragraph') ? '' : 'ghost'}
                        >
                            <Pilcrow />
                        </Button>
                    </SelectContent>
                </Select>

                <TooltipWrapper message={"Highlighter"}>
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost"
                                    style={{
                                        backgroundColor: colors.find((color) => editor.isActive('highlight', { color })) || 'transparent'
                                    }}
                                >
                                    <HighlighterIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto flex items-center gap-1 p-2">
                                {
                                    colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => editor.chain().focus().setHighlight({ color }).run()}
                                            className={`relative w-8 h-8 ${editor.isActive('textStyle', { color }) ? 'bg-primary' : ''} hover:bg-primary/90 rounded-md cursor-pointer`}
                                        >
                                            <div
                                                className="absolute inset-[6px] rounded-sm"
                                                style={{ backgroundColor: color }}
                                            />
                                        </button>
                                    ))
                                }
                                <Button
                                    variant="ghost"
                                    onClick={() => editor.chain().focus().unsetHighlight().run()}
                                    data-testid="unsetHighlight"
                                >
                                    <Eraser />
                                </Button>
                            </PopoverContent>
                        </Popover>
                    </div>
                </TooltipWrapper>



                <TooltipWrapper message={"Set Color"}>
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost"
                                    style={{
                                        backgroundColor: colors.find((color) => editor.isActive('textStyle', { color })) || 'transparent'
                                    }}
                                >
                                    <Palette />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto flex items-center gap-1 p-2">
                                {
                                    colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => editor.chain().focus().setColor(color).run()}
                                            className={`relative w-8 h-8 ${editor.isActive('textStyle', { color }) ? 'bg-primary' : ''} hover:bg-primary/90 rounded-md cursor-pointer`}
                                        >
                                            <div
                                                className="absolute inset-[6px] rounded-sm"
                                                style={{ backgroundColor: color }}
                                            />
                                        </button>
                                    ))
                                }
                                <Button
                                    variant="ghost"
                                    onClick={() => editor.chain().focus().unsetColor().run()}
                                    data-testid="unsetColor"
                                >
                                    <Eraser />
                                </Button>
                            </PopoverContent>
                        </Popover>
                    </div>
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
]

const content = `
<h2>Hi there,</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`

const Tiptap = () => {
    return (
        <EditorProvider
            slotBefore={<MenuBar />}
            extensions={extensions}
            content={content}
        />
    )
}

export default Tiptap;