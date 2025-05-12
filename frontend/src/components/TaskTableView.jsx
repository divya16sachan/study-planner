import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import React from 'react'
import { Button } from './ui/button'
import { Settings2 } from 'lucide-react'

const TaskTableView = () => {
  return (
    <Popover>
        <PopoverTrigger>
            <Button variant="outline">
                <Settings2/>
                "View"
            </Button>
        </PopoverTrigger>
        <PopoverContent>

        </PopoverContent>
    </Popover>
  )
}

export default TaskTableView
