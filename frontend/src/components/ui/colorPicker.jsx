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

const hexToHSL = (hex) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: break;
    }
    h /= 6;
  }

  return [
    Math.round(h * 360), 
    Math.round(s * 100) + "%", 
    Math.round(l * 100) + "%"
  ];
};

const ColorPicker = () => {
  const [color, setColor] = useState("#000000");
  const [hsl, setHsl] = useState(hexToHSL("#000000"));

  const handleColorChange = useCallback((newColor) => {
    setColor(newColor);
    setHsl(hexToHSL(newColor));
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

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <div className="border hover:bg-muted px-2 py-1 rounded-md flex gap-4">
            <span>{hsl[0]}</span>
            <span>{hsl[1]}</span>
            <span>{hsl[2]}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-4 bg-popover border rounded-lg"
          side="center"
          align="start"
        >
          <HexColorPicker
            color={color}
            onChange={handleColorChange}
          />
          <div className="flex gap-2 align-center mt-4">
            <Input
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
            />
            <Button 
              size="icon" 
              variant="outline" 
              className="flex-shrink-0"
              onClick={handleEyeDropper}
            >
              <Pipette/>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
