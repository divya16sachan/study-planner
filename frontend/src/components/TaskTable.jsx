import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleHelpIcon,
  CircleOff,
  Timer,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableFilter } from './TableFilters/TableFilter';
import axios from 'axios';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';

const icons = {
  priority: {
    low: ArrowDown,
    medium: ArrowRight,
    high: ArrowUp,
  },
  status: {
    backlog: CircleHelpIcon,
    todo: Circle,
    inprogress: Timer,
    done: CheckCircle,
    canceled: CircleOff,
  },
};

const filters = {
  status: ['Backlog', 'Todo', 'In progress', 'Done', 'Canceled'],
  priority: ['Low', 'Medium', 'High'],
};

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({ status: [], priority: [] });
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/constants/tasks.json');
        if (Array.isArray(response.data)) {
          setTasks(response.data);
          setFilteredTasks(response.data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const applyFilters = (tasks, filters, searchText) => {
    return tasks.filter((task) => {
      const matchesStatus =
        filters.status.length === 0 || filters.status.includes(task.status);
      const matchesPriority =
        filters.priority.length === 0 || filters.priority.includes(task.priority);
      const matchesSearch =
        searchText === '' ||
        task.title.toLowerCase().includes(searchText.toLowerCase());
      return matchesStatus && matchesPriority && matchesSearch;
    });
  };

  const handleFilterChange = (type, value) => {
    const updated = { ...selectedFilters };
    if (updated[type].includes(value)) {
      updated[type] = updated[type].filter((v) => v !== value);
    } else {
      updated[type].push(value);
    }
    setSelectedFilters(updated);
    setFilteredTasks(applyFilters(tasks, updated, search));
  };

  const handleSearchChange = (e) => {
    const text = e.target.value;
    setSearch(text);
    setFilteredTasks(applyFilters(tasks, selectedFilters, text));
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={handleSearchChange}
          className="w-full max-w-xs"
        />
        <TableFilter
          data={filters.status}
          filterName="Status"
          selected={selectedFilters.status}
          onChange={(value) => handleFilterChange('status', value)}
        />
        <TableFilter
          data={filters.priority}
          filterName="Priority"
          selected={selectedFilters.priority}
          onChange={(value) => handleFilterChange('priority', value)}
        />
      </div>

      <Table>
        <TableCaption>A list of your recent tasks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full truncate">Title</TableHead>
            <TableHead className="w-[400px]">Status</TableHead>
            <TableHead className="w-[200px]">Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.slice(0, rowsPerPage).map((task, index) => {
            const statusKey = task.status.toLowerCase().replace(/\s/g, '');
            const StatusIcon = icons.status[statusKey];
            const PriorityIcon = icons.priority[task.priority.toLowerCase()];
            return (
              <TableRow key={index}>
                <TableCell className="truncate max-w-[300px]">{task.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {StatusIcon && <StatusIcon className="size-4 text-muted-foreground" />}
                    <span className="truncate">{task.status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {PriorityIcon && <PriorityIcon className="size-4 text-muted-foreground" />}
                    <span className="truncate">{task.priority}</span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <p className="text-muted-foreground">0 of {tasks.length} row(s) selected.</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="whitespace-nowrap">Rows per page</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[70px] h-8 justify-between">
                  {rowsPerPage} <ChevronDown className="ml-1 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-32 p-1 border rounded shadow bg-popover">
                {[10, 20, 30, 40, 50].map((n) => (
                  <DropdownMenuCheckboxItem
                    key={n}
                    checked={rowsPerPage === n}
                    onCheckedChange={() => setRowsPerPage(n)}
                    className='cursor-pointer text-sm hover:bg-accent/50 py-1 px-2 rounded-sm'
                  >
                    {n}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>Page 1 of {Math.ceil(filteredTasks.length / rowsPerPage)}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="size-8">
              <ChevronsLeft />
            </Button>
            <Button variant="outline" size="icon" className="size-8">
              <ChevronLeft />
            </Button>
            <Button variant="outline" size="icon" className="size-8">
              <ChevronRight />
            </Button>
            <Button variant="outline" size="icon" className="size-8">
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskTable;
