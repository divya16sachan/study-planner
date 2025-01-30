import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
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
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import TooltipWrapper from "./TooltipWrapper";
import {
    Bold,
    Code,
    Eraser,
    HighlighterIcon,
    Italic,
    List,
    ListOrdered,
    Quote,
    Redo,
    SeparatorHorizontal,
    Strikethrough,
    Text,
    Trash,
    Undo
} from 'lucide-react'



const MenuBar = () => {
    const { editor } = useCurrentEditor()
    const [selectedHeading, setSelectedHeading] = useState(null);

    if (!editor) {
        return null
    }
    const headers = [1, 2, 3, 4, 5, 6];

    return (
        <div className="control-group sticky top-0 z-10 bg-background border-b border-input">
            <div className="Button-group flex flex-wrap">

                <TooltipWrapper message={"Ctrl + b"}>
                    <Button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={
                            !editor.can()
                                .chain()
                                .focus()
                                .toggleBold()
                                .run()
                        }
                        variant={editor.isActive('bold') ? '' : 'ghost'}
                    >
                        <Bold />
                    </Button>
                </TooltipWrapper>

                <TooltipWrapper message={"Ctrl + I"}>
                    <Button

                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={
                            !editor.can()
                                .chain()
                                .focus()
                                .toggleItalic()
                                .run()
                        }
                        variant={editor.isActive('italic') ? '' : 'ghost'}
                    >
                        <Italic />
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper message={"Ctrl + Shift + S"}>
                    <Button

                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        disabled={
                            !editor.can()
                                .chain()
                                .focus()
                                .toggleStrike()
                                .run()
                        }
                        variant={editor.isActive('strike') ? '' : 'ghost'}
                    >
                        <Strikethrough />
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper message={"Code"}>
                    <Button
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        disabled={
                            !editor.can()
                                .chain()
                                .focus()
                                .toggleCode()
                                .run()
                        }
                        variant={editor.isActive('code') ? '' : 'ghost'}
                    >
                        <Code />
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper message={"Highlighter"}>
                    <Button
                        onClick={() => editor.chain().focus().toggleHighlight({ color: '#958DF1' }).run()}
                        variant={editor.isActive('highlight') ? '' : 'ghost'}
                    >
                        <HighlighterIcon />
                    </Button>
                </TooltipWrapper>

                <TooltipWrapper message={"Clear Marks"}>
                    <Button
                        variant='ghost'
                        onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                        <Eraser />
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper message={"Clear Nodes"}>
                    <Button
                        variant='ghost'
                        onClick={() => editor.chain().focus().clearNodes().run()}>
                        <Trash />
                    </Button>
                </TooltipWrapper>

                <Select>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder={
                            editor.isActive('heading', { level: 1 }) ? 'H1' :
                                editor.isActive('heading', { level: 2 }) ? 'H2' :
                                    editor.isActive('heading', { level: 3 }) ? 'H3' :
                                        editor.isActive('heading', { level: 4 }) ? 'H4' :
                                            editor.isActive('heading', { level: 5 }) ? 'H5' :
                                                editor.isActive('heading', { level: 6 }) ? 'H6' :
                                                    'Heading...'
                        } />
                    </SelectTrigger>
                    <SelectContent className="flex-col">
                        {
                            headers.map((level, index) => (
                                <TooltipWrapper message={`Heading ${level}`}>
                                    <Button
                                        key={index}
                                        value={level}
                                        onClick={() =>
                                            editor.chain().focus().toggleHeading({ level }).run()}
                                        variant={editor.isActive('heading', { level }) ? '' : 'ghost'}
                                    >
                                        H{level}
                                    </Button>
                                </TooltipWrapper>
                            ))
                        }
                    </SelectContent>
                </Select>

                <TooltipWrapper message={"Control + Shift + 8"}>
                    <Button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        variant={editor.isActive('bulletList') ? '' : 'ghost'}
                    >
                        <List />
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper message={"Ordered List"}>
                    <Button

                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        variant={editor.isActive('orderedList') ? '' : 'ghost'}
                    >
                        <ListOrdered />
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper message={"Code Block"}>
                    <Button
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        variant={editor.isActive('codeBlock') ? '' : 'ghost'}
                    >
                        Code block
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper message={"blockquote"}>
                    <Button

                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        variant={editor.isActive('blockquote') ? '' : 'ghost'}
                    >
                        <Quote />
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper message={"Horizontal Rule"}>
                    <Button
                        variant='ghost'
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                        <SeparatorHorizontal />
                    </Button>
                </TooltipWrapper>

                <TooltipWrapper message={"Undo"}>
                    <Button
                        variant='ghost'
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={
                            !editor.can()
                                .chain()
                                .focus()
                                .undo()
                                .run()
                        }
                    >
                        <Undo />
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper message={"Redo"}>
                    <Button
                        variant='ghost'
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={
                            !editor.can()
                                .chain()
                                .focus()
                                .redo()
                                .run()
                        }
                    >
                        <Redo />
                    </Button>
                </TooltipWrapper>
                <TooltipWrapper message={""}>
                    <Button
                        onClick={() => {
                            if (editor.isActive('textStyle', { color: '#958DF1' })) {
                                editor.chain().focus().unsetColor().run();
                            } else {
                                editor.chain().focus().setColor('#958DF1').run();
                            }
                        }}
                        variant={editor.isActive('textStyle', { color: '#958DF1' }) ? '' : 'ghost'}
                    >
                        Purple
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
    Highlight.configure({ multicolor: true })
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
        <EditorProvider slotBefore={<MenuBar />} extensions={extensions} content={content}></EditorProvider>
    )
}

export default Tiptap;