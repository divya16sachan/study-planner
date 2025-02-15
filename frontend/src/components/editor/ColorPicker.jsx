import React from 'react';
import TooltipWrapper from '../TooltipWrapper';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Button } from '../ui/button';
import { Eraser } from 'lucide-react';

const ColorPicker = ({
    icon: Icon,
    tooltipMessage,
    colors,
    activeColor,
    onColorSelect,
    onUnsetColor,
    isActive,
}) => {
    return (
        <TooltipWrapper message={tooltipMessage}>
            <div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            style={{
                                backgroundColor: activeColor || 'transparent',
                            }}
                        >
                            <Icon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto flex items-center gap-1 p-2">
                        {colors.map((color) => (
                            <Button
                                key={color}
                                onClick={() => onColorSelect(color)}
                                className={`relative w-8 h-8 ${isActive(color) ? 'bg-primary' : ''} hover:bg-accent rounded-md cursor-pointer`}
                            >
                                <div
                                    className="absolute inset-[6px] rounded-sm"
                                    style={{ backgroundColor: color }}
                                />
                            </Button>
                        ))}
                        <Button
                            variant="ghost"
                            onClick={onUnsetColor}
                            data-testid={`unset${tooltipMessage.replace(/\s+/g, '')}`}
                        >
                            <Eraser />
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>
        </TooltipWrapper>
    );
};

export default ColorPicker;