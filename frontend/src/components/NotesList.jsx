import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil } from 'lucide-react';
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
import useNoteStore from '@/stores/noteStore';

const NotesList = () => {
  const { notes, addNote, updateNote, deleteNote } = useNoteStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (editingNote) {
      updateNote(editingNote.id, formData.title, formData.description);
    } else {
      addNote(formData.title, formData.description);
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="w-full max-w-3xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notes</h2>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
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
                />
              </div>
              <div className="flex justify-end gap-2">
                {editingNote && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      deleteNote(editingNote.id);
                      setIsDialogOpen(false);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                )}
                <Button type="submit">
                  {editingNote ? 'Update' : 'Create'} Note
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
              key={note.id} 
              className="hover:shadow-md bg-accent/30 transition-shadow cursor-pointer"
              onClick={() => handleEditClick(note)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{note.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {note.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(note);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;