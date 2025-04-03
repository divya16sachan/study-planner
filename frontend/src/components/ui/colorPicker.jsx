import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "./button";
import { Input } from "./input";

const ColorPicker = () => {
  const {color, setColor} = useState('#000000');
  
  return (
    <div>
      <Popover>
        <PopoverTrigger>
            <div className="border hover:bg-muted px-2 py-1 rounded-md flex gap-4">
              <span>245</span>
              <span>50%</span>
              <span>23%</span>
            </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-4 bg-popover border rounded-lg"
          side="center" 
          align="start"
        >
          <HexColorPicker />
          <Input 
            className="mt-4"
            value={color}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
