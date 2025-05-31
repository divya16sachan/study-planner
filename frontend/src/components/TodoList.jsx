import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Plug, Plus, Trash2 } from 'lucide-react';
import useTodoStore from '@/stores/todoStore';
import { Button } from './ui/button';

const TodoList = () => {
  const { todos, addTodo, toggleTodo, updateTodo, deleteTodo } = useTodoStore();
  const [newTodoText, setNewTodoText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Calculate progress
  const completedCount = todos.filter(todo => todo.completed).length;
  const progress = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addTodo(newTodoText);
      setNewTodoText('');
    }
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = (id) => {
    if (editText.trim()) {
      updateTodo(id, editText);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-4 w-full max-w-md mx-auto p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Todo List</h2>
          <div className="text-sm text-muted-foreground">
            {completedCount}/{todos.length} completed
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50"
          >
            <Checkbox
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onCheckedChange={() => toggleTodo(todo.id)}
              className="h-5 w-5 rounded-full"
            />

            {editingId === todo.id  ? (
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => handleSaveEdit(todo.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(todo.id)}
                autoFocus
                className="h-8 border-none ring-0 outline-none flex-1"
              />
            ) : (
              <label
                htmlFor={`todo-${todo.id}`}
                className={`flex-1 text-sm line-clamp-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                onClick={() => handleStartEdit(todo)}
              >
                {todo.text}
              </label>
            )}

            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddTodo} className="flex items-center gap-2 pt-2">
        <Input
          type="text"
          placeholder="New todo"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          className="h-8"
        />
        <Button
            size="icon"
            variant="ghost"
            className="flex-shrink-0"
        >
          <Plus/>
        </Button>
      </form>
    </div>
  );
};

export default TodoList;