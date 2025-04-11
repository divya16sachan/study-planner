import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import React, { useState, useCallback, useMemo } from "react";
import { HexColorPicker } from "react-colorful";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Pipette } from "lucide-react";

const ColorPicker = ({ defaultColor, onColorChange }) => {
  const [color, setColor] = useState(defaultColor || "#000");

  const handleColorChange = useCallback((newColor) => {
    setColor(newColor);
    if (onColorChange && typeof onColorChange === "function") {
      onColorChange(newColor);
    }
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

  const getIconColor = useCallback((backgroundColor) => {
    if (!backgroundColor) return "#000000";
    
    let lightness = 0;
    
    if (backgroundColor.startsWith("#")) {
      // HEX color processing
      const hex = backgroundColor.replace("#", "");
      const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16) / 255;
      
      // Calculate lightness (perceived brightness)
      lightness = (Math.max(r, g, b) + Math.min(r, g, b)) / 2 * 100;
    } else {
      // HSL color processing
      const parts = backgroundColor.split(/\s+/);
      if (parts.length >= 3) {
        lightness = parseFloat(parts[2].replace("%", ""));
      }
    }
    
    // Return black for light backgrounds, white for dark backgrounds
    return lightness > 50 ? "#000000" : "#FFFFFF";
  }, []);
  
  const iconColor = useMemo(() => getIconColor(color), [color, getIconColor]);
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
            style={{ color: iconColor }}
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
