import { Extension, ReactRenderer } from "@tiptap/react";
import Suggestion from '@tiptap/suggestion';
import SuggestionList from "./SuggestionList.jsx";
import tippy from "tippy.js";
import {
    CodeSquare,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    Image,
    List,
    ListOrdered,
    ListTodo,
    Minus,
    Quote,
    Table
} from "lucide-react";

const shortcut = {
    'heading 1': 'h1',
    'heading 2': 'h2',
    'heading 3': 'h3',
    'heading 4': 'h4',
    'heading 5': 'h5',
    'heading 6': 'h6',
};

const filterSuggestions = (query, suggestions) => {
    const queryLower = query.toLowerCase();

    return suggestions.filter(item => {
        if(shortcut[item.label.toLowerCase()] === query.toLowerCase()){
            return true;
        }
        return item.label.toLowerCase().startsWith(query.toLowerCase());
    });
};

export const SlashCommand = Extension.create({
    name: 'slashCommand',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                items: ({ query }) => {
                    // Filter suggestions based on the query
                    const suggestions = [
                        { icon: <Heading1 />, label: 'Heading 1', command: 'setHeading', props: { level: 1 } },
                        { icon: <Heading2 />, label: 'Heading 2', command: 'setHeading', props: { level: 2 } },
                        { icon: <Heading3 />, label: 'Heading 3', command: 'setHeading', props: { level: 3 } },
                        { icon: <Heading4 />, label: 'Heading 4', command: 'setHeading', props: { level: 4 } },
                        { icon: <Heading5 />, label: 'Heading 5', command: 'setHeading', props: { level: 5 } },
                        { icon: <Heading6 />, label: 'Heading 6', command: 'setHeading', props: { level: 6 } },
                        { icon: <List />, label: 'Bullet List', command: 'toggleBulletList' },
                        { icon: <ListOrdered />, label: 'Numbered List', command: 'toggleOrderedList' },
                        { icon: <ListTodo />, label: 'Task List', command: 'toggleTaskList' },
                        { icon: <Quote />, label: 'Blockquote', command: 'toggleBlockquote' },
                        { icon: <CodeSquare />, label: 'Code Block', command: 'toggleCodeBlock' },
                        { icon: <Table />, label: 'Table', command: 'insertTable' },
                        { icon: <Image />, label: 'Image', command: 'insertImage' },
                        { icon: <Minus />, label: 'Horizontal Rule', command: 'setHorizontalRule' },
                    ];
                    return filterSuggestions(query, suggestions);
                },
                render: () => {
                    let component;
                    let popup;

                    return {
                        onStart: (props) => {
                            component = new ReactRenderer(SuggestionList, {
                                props: { items: props.items, command: props.command, editor: props.editor, range: props.range },
                                editor: props.editor,
                            });

                            if (!props.clientRect) {
                                return;
                            }

                            popup = tippy('body', {
                                getReferenceClientRect: props.clientRect,
                                appendTo: document.body,
                                content: component.element,
                                showOnCreate: true,
                                interactive: true,
                                trigger: 'manual',
                                placement: 'bottom-start',
                            });
                        },

                        onUpdate: (props) => {
                            component.updateProps({ items: props.items, command: props.command, editor: props.editor, range: props.range });

                            if (props.items.length === 0) {
                                // Hide the popup if there are no items
                                popup[0].hide();
                            } else {
                                // Show the popup if there are items
                                popup[0].show();
                            }

                            if (!props.clientRect) return;
                            popup[0].setProps({
                                getReferenceClientRect: props.clientRect,
                            });
                        },

                        onKeyDown: (props) => {
                            if (props.event.key === 'Escape') {
                                popup[0].hide();
                                return true;
                            }
                            return component.ref?.onKeyDown(props.event);
                        },

                        onExit: () => {
                            popup[0].destroy();
                            component.destroy();
                        },
                    };
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});