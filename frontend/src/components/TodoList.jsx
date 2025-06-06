import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CircleCheckBig, Plug, Plus, Trash2 } from 'lucide-react';
import useTodoStore from '@/stores/todoStore';
import { Button } from './ui/button';
import CircularProgress from './CircularProgress';

const TodoList = ({ className = "" }) => {
  const { todos, addTodo, toggleTodo, updateTodo, deleteTodo } = useTodoStore();
  const [newTodoText, setNewTodoText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Calculate progress
  const completedCount = todos.filter(todo => todo.completed).length;
  // const progress = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;
  const progress = todos.length > 0 ? ((completedCount / todos.length) * 100).toFixed(1) : 0;

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
    <div className={`space-y-4 min-w-72 w-full bg-accent/30 rounded-lg border p-4 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 tracking-tight leading-none font-semibold">
              <span>Todo List</span>
              <CircleCheckBig className='size-4'/>
            </h2>
            <div className="text-sm text-muted-foreground">
              {completedCount}/{todos.length} completed
            </div>
          </div>
          <CircularProgress value={progress} size={60} strokeWidth={6} textSize='xs' />
        </div>

      </div>

      <div>
        {todos.length === 0
          ? (
            <div className="text-center space-y-2 text-muted-foreground text-sm">
              <div className='size-28 mx-auto grayscale opacity-50 aspect-square overflow-hidden'>
                <img className='w-full h-full object-contain'  src="./empty-note-state.svg" alt="" />
              </div>
              <p>No todos yet. Add your first todo to start</p>
            </div>
          )
          : (
            todos.map((todo) => (
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

                {editingId === todo.id ? (
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
            ))
          )
        }
      </div>

      <form onSubmit={handleAddTodo} className="flex items-center gap-2 pt-2">
        <Input
          type="text"
          placeholder="New todo"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          className="h-9 bg-input"
        />
        <Button
          type="submit"
          variant="secondary"
          className="h-9 bg-input/30"
          disabled={!newTodoText.trim()}
        >
          Add
        </Button>
      </form>
    </div>
  );
};

export default TodoList;