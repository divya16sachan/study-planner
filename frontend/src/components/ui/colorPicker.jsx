import { useState, useCallback } from "react";
import { HexColorPicker, HslColorPicker } from "react-colorful";
import { Input } from "./input";
import { Card, CardContent, CardHeader } from "./card";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";
import { ChevronDown } from "lucide-react";

export function ColorPicker() {
  const [color, setColor] = useState("#2d3748");
  const [hsl, setHsl] = useState({ h: 225, s: 33, l: 17 });
  const [mode, setMode] = useState("hsl");

  const handleHexChange = useCallback((hex) => {
    setColor(hex);
    // Convert hex to HSL here if needed
  }, []);

  const handleHslChange = useCallback(({ h, s, l }) => {
    setHsl({ h, s, l });
    // Convert HSL to hex here if needed
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between">
          <div className="flex gap-2 items-center">
            <div
              className="h-4 w-4 rounded-full border"
              style={{
                backgroundColor: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
              }}
            />
            <span>
              {hsl.h}° {hsl.s}% {hsl.l}%
            </span>
          </div>
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Card className="w-[300px]">
          <CardHeader className="p-4">
            <div
              className="h-16 w-full rounded-md border"
              style={{
                backgroundColor:
                  mode === "hex"
                    ? color
                    : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
              }}
            />
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMode("hsl")}
                className={`px-3 py-1 text-sm rounded ${
                  mode === "hsl" ? "bg-gray-200" : ""
                }`}
              >
                HSL
              </button>
              <button
                onClick={() => setMode("hex")}
                className={`px-3 py-1 text-sm rounded ${
                  mode === "hex" ? "bg-gray-200" : ""
                }`}
              >
                HEX
              </button>
            </div>

            {mode === "hsl" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">H</label>
                    <Input
                      value={hsl.h}
                      onChange={(e) =>
                        setHsl({ ...hsl, h: Number(e.target.value) })
                      }
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">S</label>
                    <Input
                      value={hsl.s}
                      onChange={(e) =>
                        setHsl({ ...hsl, s: Number(e.target.value) })
                      }
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">L</label>
                    <Input
                      value={hsl.l}
                      onChange={(e) =>
                        setHsl({ ...hsl, l: Number(e.target.value) })
                      }
                      className="h-8"
                    />
                  </div>
                </div>

                <HslColorPicker
                  color={{ h: hsl.h, s: hsl.s / 100, l: hsl.l / 100 }}
                  onChange={(color) =>
                    setHsl({
                      h: Math.round(color.h),
                      s: Math.round(color.s * 100),
                      l: Math.round(color.l * 100),
                    })
                  }
                  className="!w-full"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  value={color}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="h-8"
                />
                <HexColorPicker
                  color={color}
                  onChange={handleHexChange}
                  className="!w-full"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
