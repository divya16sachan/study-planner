import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Folder, FolderPlus, Loader2, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useNoteStore } from "@/stores/useNoteStore"
import TooltipWrapper from "./TooltipWrapper"

const AddNoteDialog = ({ trigger }) => {
    const [noteName, setNoteName] = useState('');
    const [collectionName, setCollectionName] = useState('');
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);

    const {
        collections,
        createCollection,
        isCreatingCollection,

        createNote,
        isCreatingNote
    } = useNoteStore();

    const [selectedCollection, setSelectedCollection] = useState(null);


    const handleAddNote = async () => {
        setNoteName(noteName.trim());
        if (!noteName) {
            setErrors({ noteName: "noteName must required" });
            return;
        }
        if (!selectedCollection) {
            setErrors({ collection: "Choose a collection first" });
            return;
        }
        await createNote({
            name: noteName,
            collectionId: selectedCollection._id,
        })

        setNoteName('');
        setOpen(false);
    }
    const handleAddCollection = async () => {
        const collection = await createCollection({ name: collectionName });
        if (collection) {
            setSelectedCollection(collection);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] scrollbar-sm">
                <DialogHeader>
                    <DialogTitle className="hidden">Create Note</DialogTitle>
                </DialogHeader>
                <div className="py-4">

                    <div className="mb-5 space-y-2">
                        {errors.noteName && <p className="text-destructive text-sm font-semibold -mb-2">{errors.noteName}</p>}
                        <Input
                            placeholder="Note Title"
                            id="name"
                            value={noteName}
                            onChange={e => setNoteName(e.target.value)}
                        />
                        <Input
                            readOnly
                            placeholder="Choose a collection"
                            className="pointer-events-none"
                            value={selectedCollection?.name}
                        />
                    </div>

                    <div className="space-y-1">
                        <Command className="border max-h-52">
                            <CommandInput placeholder="Search ..." />
                            <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup>
                                    {
                                        collections.map((collection) => (
                                            <CommandItem
                                                key={collection._id}
                                                value={collection.name}
                                                onSelect={() => setSelectedCollection(collection)}
                                            >
                                                <Folder className="text-muted-foreground" /> {collection.name}
                                            </CommandItem>
                                        ))
                                    }
                                </CommandGroup>
                            </CommandList>
                        </Command>
                        <div className="flex gap-2 ">
                            <Input
                                placeholder="Add Collection"
                                value={collectionName}
                                onChange={(e) => setCollectionName(e.target.value)}
                            />
                            <TooltipWrapper message="Create New Collection">
                                <Button
                                    disabled={isCreatingCollection}
                                    variant="outline"
                                    className="flex-shrink-0 relative overflow-hidden"
                                    onClick={handleAddCollection}
                                    size="icon"
                                >
                                    {
                                        isCreatingCollection ?
                                            <Loader2 className="animate-spin" /> :
                                            <FolderPlus />
                                    }
                                </Button>
                            </TooltipWrapper>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        disabled={!selectedCollection || isCreatingNote}
                        onClick={handleAddNote}>
                        {
                            isCreatingNote ?
                                <>
                                    <Loader2 className="animate-spin" /> Adding...
                                </> :
                                <>
                                    <Plus /> Add Note
                                </>
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNoteDialog