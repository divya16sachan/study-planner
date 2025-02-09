import React, { useState } from 'react'
import { Separator } from './ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { EllipsisVertical, Folder, FolderOutput, Pencil, Trash2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { useNoteStore } from '@/stores/useNoteStore';
import { Input } from './ui/input';

const NotesOption = ({ trigger, note }) => {
    const { isMobile } = useIsMobile();
    const { deleteNote, renameNote, moveTo, collections } = useNoteStore();
    const [noteNewName, setNoteNewName] = useState('');
    const [open, setOpen] = useState(false);
    const [renameOpen, setRenameOpen] = useState(false);
    const [moveOpen, setMoveOpen] = useState(false);

    const handleRename = () => {
        renameNote({
            noteId: note._id,
            newName: noteNewName,
        });
        setRenameOpen(false);
        setOpen(false);
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

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button size="icon" className="p-1 bg-transparent text-muted-foreground hover:text-primary hover:bg-transparent">
                    {trigger}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-48 rounded-lg p-1"
                side="left"
                align="start"
            >
                <Popover open={renameOpen} onOpenChange={setRenameOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={renameOpen ? "secondary" : "ghost"}
                            className="font-normal p-2 h-auto w-full justify-start "
                        >
                            <Pencil className="text-muted-foreground" />
                            <span>Rename</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                        className="w-70 rounded-lg" 
                        >
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <div className="flex items-center gap-4">
                                    <Input
                                        className="col-span-2 h-8"
                                        placeholder="New name"
                                        value={noteNewName}
                                        onChange={e => setNoteNewName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button variant="secondary" onClick={handleRename}>
                                Rename
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

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
                                                onSelect={handleMove}
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
