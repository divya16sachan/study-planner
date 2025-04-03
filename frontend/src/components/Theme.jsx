import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ColorPicker from "./ui/colorPicker";

const properties = [
    'background',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'destructive-foreground',
    'border',
    'input',
    'ring',
    'Chart Colors',
]

const charts = [
    'chart-1',
    'chart-2',
    'chart-3',
    'chart-4',
    'chart-5',
]

const Theme = () => {
  return (
    <div className="rounded-md overflow-hidden border">
      <div>
        <div className="h-10 bg-muted flex items-center justify-between">
          <h3 className="mx-2 font-semibold">Theme Properties</h3>
          <Button variant="ghost">Save Theme</Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Theme Name</Label>
            <Input id="name" placeholder="Name of your project" />
          </div>

          <div>
            <Label>Radius (rem)</Label>
            <div className="flex gap-2">
              <Button className="flex-1" variant="outline">
                0
              </Button>
              <Button className="flex-1" variant="outline">
                0.3
              </Button>
              <Button className="flex-1" variant="outline">
                0.5
              </Button>
              <Button className="flex-1" variant="outline">
                0.75
              </Button>
              <Button className="flex-1" variant="outline">
                1
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="h-10 bg-muted flex items-center justify-between">
          <h3 className="mx-2 font-semibold">Theme Color</h3>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3">
            {
                properties.map((name)=>(
                    <div key={name} className="flex flex-col gap-2">
                        <Label>{name}</Label>
                        <ColorPicker/>
                    </div>
                ))
            }

        </div>
      </div>

      <div>
        <div className="h-10 bg-muted flex items-center justify-between">
          <h3 className="mx-2 font-semibold">Theme Color</h3>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3">
            {
                charts.map((name)=>(
                    <div key={name} className="flex flex-col gap-2">
                        <Label>{name}</Label>
                        <ColorPicker/>
                    </div>
                ))
            }

        </div>
      </div>
    </div>
  );
};

export default Theme;


