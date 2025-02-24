import React, { useEffect, useState } from 'react';
import { Separator } from './ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { EllipsisVertical, Folder, FolderOutput, Pencil, Trash2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { useNoteStore } from '@/stores/useNoteStore';

const NotesOption = ({ trigger, note, nameRef, setIsRenaming }) => {
    const { isMobile } = useIsMobile();
    const { renameNote, moveTo, deleteNote, collections } = useNoteStore();
    const [open, setOpen] = useState(false);
    const [moveOpen, setMoveOpen] = useState(false);
    const handleBlur = () => {
        console.log('blur event triggered');
        if (nameRef?.current) {
            const newName = nameRef.current.textContent.trim();
            if (!newName) {
                nameRef.current.textContent = note.name;
            }
            else if (newName && newName !== note.name) {
                renameNote({
                    noteId: note._id,
                    newName: newName,
                });
            }
        }
        setIsRenaming(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nameRef?.current) {
                nameRef.current.blur();
            }
        }
    };

    const selectAllText = (node) => {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    const handleRename = () => {
        setIsRenaming(note._id);
        setTimeout(() => {
            if (nameRef?.current) {
                nameRef.current.focus();
                selectAllText(nameRef.current);
            }
        });
    };

    const handleMove = async (collectionId) => {
        await moveTo({
            collectionId,
            noteId: note._id,
        });
        setMoveOpen(false);
        setOpen(false);
    };

    const handleDelete = () => {
        deleteNote(note._id);
        setOpen(false);
    };

    useEffect(() => {
        const current = nameRef?.current;
        if (current) {
            current.addEventListener('blur', handleBlur);
            current.addEventListener('keydown', handleKeyDown);

            return () => {
                current.removeEventListener('blur', handleBlur);
                current.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [nameRef, handleBlur, handleKeyDown]);

    return (
        <Popover modal="true" open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="flex-shrink-0 p-1 size-6  text-muted-foreground hover:text-primary hover:bg-transparent">
                    {trigger}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-48 rounded-lg p-1"
                side="bottom"
                align="start"
            >
                <Button
                    variant="ghost"
                    className="font-normal p-2 h-auto w-full justify-start "
                    onClick={handleRename}
                >
                    <Pencil className="text-muted-foreground" />
                    <span>Rename</span>
                </Button>

                <Popover open={moveOpen} onOpenChange={setMoveOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={moveOpen ? "secondary" : "ghost"}
                            className="font-normal p-2 h-auto w-full justify-start"
                        >
                            <FolderOutput className="text-muted-foreground" />
                            <span>Move to</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                        <Command>
                            <CommandInput placeholder="Change status..." />
                            <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup>
                                    {collections.filter(c => c._id !== note.collectionId)
                                        .map((collection) => (
                                            <CommandItem
                                                key={collection._id}
                                                value={collection._id}
                                                onSelect={() => handleMove(collection._id)}
                                            >
                                                <Folder className="text-muted-foreground" /> {collection.name}
                                            </CommandItem>
                                        ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                <Separator orientation="horizontal" className="my-2" />
                <Button
                    variant="ghost"
                    className="font-normal p-2 h-auto w-full justify-start"
                    onClick={handleDelete}
                >
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Note</span>
                </Button>
            </PopoverContent>
        </Popover>
    );
};

export default NotesOption;
