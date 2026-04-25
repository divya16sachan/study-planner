
// components/NotesList.jsx - Updated version
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, File, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useNoteStore from '@/stores/noteStore';

const NotesList = () => {
  const { 
    notes, 
    isLoading, 
    isCreating, 
    isUpdating, 
    isDeleting,
    error,
    fetchNotes, 
    addNote, 
    updateNote, 
    deleteNote,
    clearError
  } = useNoteStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Clear error when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      clearError();
    }
  }, [isDialogOpen, clearError]);

  const handleAddClick = () => {
    setFormData({ title: '', description: '' });
    setEditingNote(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (note) => {
    setFormData({ title: note.title, description: note.description });
    setEditingNote(note);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    let result;
    if (editingNote) {
      result = await updateNote(editingNote._id, formData.title, formData.description);
    } else {
      result = await addNote(formData.title, formData.description);
    }

    if (result.success) {
      setIsDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!editingNote) return;
    
    const result = await deleteNote(editingNote._id);
    if (result.success) {
      setIsDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl flex items-center gap-2 font-bold">
          <span>Notes</span>
          <File className='size-5' />
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddClick}>
              <Plus className="mr-2 h-4 w-4" /> New Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingNote ? 'Edit Note' : 'Create New Note'}</DialogTitle>
            </DialogHeader>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  disabled={isCreating || isUpdating}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  disabled={isCreating || isUpdating}
                />
              </div>
              <div className="flex justify-end gap-2">
                {editingNote && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting || isUpdating}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </>
                    )}
                  </Button>
                )}
                <Button 
                  type="submit"
                  disabled={isCreating || isUpdating}
                >
                  {(isCreating || isUpdating) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingNote ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      {editingNote ? 'Update' : 'Create'} Note
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold">No notes yet</h3>
          <p className="text-muted-foreground">Click "New Note" to create your first note</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <Card
              key={note._id}
              className="hover:shadow-md bg-accent/30 transition-shadow cursor-pointer"
              onClick={() => handleEditClick(note)}
            >
              <CardHeader className="pb-2 flex items-center flex-row justify-between">
                <CardTitle className="text-lg">{note.title}</CardTitle>
                <div className='text-xs text-muted-foreground leading-none'>
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {note.description || 'No description'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;