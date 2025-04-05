import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import React, { useState, useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import { Input } from "./input";
import { Button } from "./button";
import { Pipette } from "lucide-react";

const ColorPicker = ({ defaultColor }) => {
  const [color, setColor] = useState(defaultColor || "#000");
  const handleColorChange = useCallback((newColor) => {
    setColor(newColor);
  }, []);

  const handleEyeDropper = useCallback(async () => {
    if (!window.EyeDropper) return alert("EyeDropper not supported");
    const eyeDropper = new window.EyeDropper();
    try {
      const result = await eyeDropper.open();
      handleColorChange(result.sRGBHex);
    } catch (e) {
      console.error(e);
    }
  }, [handleColorChange]);

  const getIconColor = (backgroundColor) => {
    if(!backgroundColor) return "#000000";
    console.log(backgroundColor);
    const lightness = parseFloat(
      backgroundColor.split(" ")[2]?.replace("%", "")
    );
    return lightness > 50 ? "#000000" : "#ffffff";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          style={{ background: color }}
          className="rounded-full w-full group bg-background hover:bg-none"
        >
          <Pipette
            className={`size-5 opacity-0 group-hover:opacity-100 transition-opacity`}
            style={{color: getIconColor(color)}}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-2 bg-accent border rounded-lg w-min"
        // side="center"
        // align="start"
      >
        <HexColorPicker color={color} onChange={handleColorChange} />
        <div className="flex gap-2 align-center mt-4">
          <Input
            value={color}
            className="bg-background"
            onChange={(e) => handleColorChange(e.target.value)}
          />
          <Button
            size="icon"
            variant="outline"
            className="flex-shrink-0"
            onClick={handleEyeDropper}
          >
            <Pipette />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
