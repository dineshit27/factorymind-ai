
import React, { useState, useEffect } from 'react';
import { Pencil, Save, Trash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export function NotesFeature() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('aquawatt-notes');
    if (savedNotes) {
      try {
        const parsedNotes: unknown = JSON.parse(savedNotes);
        if (Array.isArray(parsedNotes)) {
          const processedNotes: Note[] = parsedNotes
            .filter((n): n is { id: string; title: string; content: string; createdAt: string | Date } =>
              typeof n === 'object' && n !== null && 'id' in n && 'title' in n && 'content' in n && 'createdAt' in n)
            .map(n => ({
              id: String(n.id),
              title: String(n.title),
              content: String(n.content),
              createdAt: new Date(n.createdAt)
            }));
          setNotes(processedNotes);
        }
      } catch (error) {
        console.error('Failed to parse saved notes:', error);
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('aquawatt-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNoteTitle.trim()) {
      toast({ 
        title: "Note title is required", 
        description: "Please enter a title for your note.",
        variant: "destructive"
      });
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      createdAt: new Date()
    };

    setNotes([newNote, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setShowAddNote(false);
    
    toast({
      title: "Note added",
      description: "Your note has been saved successfully."
    });
  };

  const updateNote = (id: string) => {
    if (!newNoteTitle.trim()) {
      toast({ 
        title: "Note title is required", 
        description: "Please enter a title for your note.",
        variant: "destructive"
      });
      return;
    }

    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, title: newNoteTitle, content: newNoteContent } 
        : note
    ));
    
    setEditingNoteId(null);
    setNewNoteTitle('');
    setNewNoteContent('');
    
    toast({
      title: "Note updated",
      description: "Your note has been updated successfully."
    });
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    
    toast({
      title: "Note deleted",
      description: "Your note has been deleted."
    });
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">My Notes</h2>
        {!showAddNote && (
          <Button 
            onClick={() => setShowAddNote(true)}
            className="transition-transform duration-300 hover:scale-105"
          >
            Add Note
          </Button>
        )}
      </div>

      {showAddNote && (
        <Card className="border border-border animate-fade-in">
          <CardHeader>
            <CardTitle>
              <Input
                placeholder="Note title"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="border-none text-lg font-bold bg-transparent p-0"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write your note here..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-[120px] border-none resize-none bg-transparent p-0"
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddNote(false);
                setNewNoteTitle('');
                setNewNoteContent('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={addNote}>Save Note</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card 
            key={note.id}
            className="group border border-border transition-all duration-300 hover:shadow-md hover:border-primary"
          >
            {editingNoteId === note.id ? (
              <>
                <CardHeader>
                  <CardTitle>
                    <Input
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="border-none text-lg font-bold bg-transparent p-0"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="min-h-[100px] border-none resize-none bg-transparent p-0"
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(note.createdAt)}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={cancelEditing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => updateNote(note.id)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>{note.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap break-words">{note.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(note.createdAt)}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => startEditing(note)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => deleteNote(note.id)}
                      className="h-8 w-8"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
        ))}
      </div>

      {notes.length === 0 && !showAddNote && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">You don't have any notes yet.</p>
          <Button 
            variant="outline" 
            onClick={() => setShowAddNote(true)}
            className="mt-2"
          >
            Create your first note
          </Button>
        </div>
      )}
    </div>
  );
}
